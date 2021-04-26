<template>
	<v-main>
      <v-container fluid>
		<h1>Families of the Congregation </h1>
		<v-row align="end">
			<v-col lg="2" align="center">
				<v-btn
					class="mr-4"
					color="primary"
					to="/familyadd"
					dark
					v-if="showModeratorBoard || showAdminBoard"
				>
					New Family
				</v-btn>
			</v-col>
			<v-col>
				<v-text-field
					v-model="search"
					label="Search Families"
					@input="filterFamilies"
				></v-text-field>
			</v-col>
			<v-col lg="2" align="center">
				<GenerateDirectory
					v-if="families.length != 0"
					v-bind:families="families"
				></GenerateDirectory>
			</v-col>
		</v-row>
		<v-divider> </v-divider>
        <v-row>
			<v-col
				v-for="family in searchFamilies"
				:key="family.fam_ID"
				cols="4"
			>
				<FamilyCard 
					v-bind:key="family.fam_ID"
					v-bind:family="family"
				></FamilyCard>
			</v-col>
        </v-row>
      </v-container>
    </v-main>
</template>

<script>
import FamilyService from "../services/FamilyService";
import FamilyCard from "../components/FamilyCard";
import GenerateDirectory from "../components/GenerateDirectory";

export default {
	name: 'Families-List',
	components: {
		FamilyCard,
		GenerateDirectory
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
                this.message = error.response.data.message;
            });
		},
		filterFamilies() {
			this.searchFamilies = this.families.filter((family) => {
				return family.fam_name.toLowerCase().includes(this.search.toLowerCase());
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