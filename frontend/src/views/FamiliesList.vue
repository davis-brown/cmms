<template>
	<div>
		<PageBand title="Families of the Congregation">
			<v-btn
				color="primary"
				to="/familyadd"
				prepend-icon="mdi-plus"
				v-if="showModeratorBoard || showAdminBoard"
			>
				New Family
			</v-btn>
			<GenerateDirectory
				v-if="families.length != 0"
				v-bind:families="families"
			></GenerateDirectory>
		</PageBand>
		<div class="page-body">
			<v-text-field
				v-model="search"
				label="Search Families"
				prepend-inner-icon="mdi-magnify"
				style="max-width: 520px"
				@update:model-value="filterFamilies"
			></v-text-field>
			<p v-if="searchFamilies.length === 0" class="text-medium-emphasis">
				{{ families.length === 0 ? 'No families yet.' : `No family matches “${search}”.` }}
			</p>
			<v-row>
				<v-col
					v-for="family in searchFamilies"
					:key="family.fam_ID"
					cols="12"
					sm="6"
					lg="4"
				>
					<FamilyCard v-bind:family="family"></FamilyCard>
				</v-col>
			</v-row>
		</div>
	</div>
</template>

<script>
import FamilyService from "../services/FamilyService";
import FamilyCard from "../components/FamilyCard";
import GenerateDirectory from "../components/GenerateDirectory";
import PageBand from "../components/PageBand.vue";

export default {
	name: 'Families-List',
	components: {
		FamilyCard,
		GenerateDirectory,
		PageBand
	},
    data() {
        return {
            families: [],
			searchFamilies: [],
			search: ""
        };
    },
	computed: {
        currentUser() {
            return this.$store.state.auth.user;
        },
        showAdminBoard() {
            if (this.currentUser && this.currentUser.roles) {
                return this.currentUser.roles.includes('ROLE_ADMIN');
            }
            return false;
        },
        showModeratorBoard() {
            if (this.currentUser && this.currentUser.roles) {
                return this.currentUser.roles.includes('ROLE_MODERATOR');
            }
            return false;
        }
    },
	methods: {
		getFamilies()  {
			FamilyService.getFamilies()
            .then(response => {
                this.families = response.data;
				this.searchFamilies = response.data;
            })
            .catch(error => {
                this.message = (error.response && error.response.data.message) || error.message;
            });
		},
		filterFamilies() {
			this.searchFamilies = this.families.filter((family) => {
				return (family.fam_name || '').toLowerCase().includes((this.search || '').trim().toLowerCase());
			});
		}
    },
	mounted() {
		this.getFamilies();
	}
};
</script>

<style>
.list {
	text-align: left;
	max-width: 1400px;
	margin: fixed;
}

.add-button {
	margin-left:71%; 
	margin-right:0;
}
</style>