<template>
	<v-main>
      <v-container fluid>
		<h1>Families of the Congregation </h1>
		<v-btn
            class="mr-4"
            color="primary"
            to="/familyadd"
            dark
          >
            New Family
        </v-btn>
		<GenerateDirectory
			v-if="families.length != 0"
			v-bind:families="families"
		></GenerateDirectory>
	<v-divider> </v-divider>
        <v-row>
			<v-col
				v-for="family in families"
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
            families: []
            
        };
    },
	methods: {
		getFamilies()  {
			FamilyService.getFamilies()
            .then(response => {
                this.families = response.data;
            })
            .catch(error => {
                this.message = error.response.data.message;
            });
		},
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