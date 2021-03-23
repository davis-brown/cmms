<template>
	<v-card class="mx-auto">
        <v-img
        :src="this.path + family.fam_pic"
        height = "300px"
        width = "400px"
        ></v-img>

        <v-card-title>
        {{ family.fam_name}}
        </v-card-title>

        <v-card-subtitle>
        {{ familyNames }}
        </v-card-subtitle>

        <v-card-subtitle>
        Contact Information
        </v-card-subtitle>

        <v-card-actions>
        <v-btn
        @click="editFamily(family)"
        class="ma-2"
        outlined
        fab
        color="blue darken-4"
        align="right"
        >
        <v-icon>mdi-pencil</v-icon>
        </v-btn>				
        </v-card-actions>
    </v-card>
</template>

<script>
import FamilyPersonService from "../services/FamilyPersonService";

export default {
	name: 'Families-List',
    props: ['family'],
    data() {
        return {
            familyPersons: [],
			familyNames: "",
            path: ""
            
        };
    },
    
	methods: {

		editFamily(family) {
            this.$router.push({ name: 'familyedit', params: { id: family.fam_ID } });
        },

        getPeopleForFamily(fam_ID)  {
			FamilyPersonService.getFamilyPersons(fam_ID)
			.then(response => {
				this.familyPersons = response.data;
                this.familyPersons.forEach( familyPerson => {this.familyNames += familyPerson.person.frst_name + ", "});
                console.log(this.familyNames);
                this.familyNames = this.familyNames.slice(0, -2);
                console.log(this.familyNames);
			})
			.catch(error => {
				this.message = error.response.data.message;
			});
		},
    },
    mounted() {
        this.getPeopleForFamily(this.family.fam_ID)
        this.path = "http://localhost:8080/images";
    }
};
</script>

<style>

</style>