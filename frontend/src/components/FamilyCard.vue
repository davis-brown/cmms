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

        <v-card-subtitle >
        Email: {{ family.fam_email }}
        </v-card-subtitle>

        <v-card-subtitle >
        Phone: {{ family.fam_phone }}
        </v-card-subtitle>

        <v-card-subtitle >
        Address: {{ family.fam_address }}
        </v-card-subtitle>

        <v-card-actions>
        <v-btn
            @click="editFamily(family)"
            class="ma-2"
            outlined
            fab
            color="blue darken-4"
            align="right"
            v-if="showModeratorBoard || showAdminBoard"
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

		editFamily(family) {
            this.$router.push({ name: 'familyedit', params: { id: family.fam_ID } });
        },

        getPeopleForFamily(fam_ID)  {
			FamilyPersonService.getFamilyPersons(fam_ID)
			.then(response => {
				this.familyPersons = response.data;
                this.familyPersons.forEach( familyPerson => {this.familyNames += familyPerson.person.frst_name + ", "});
                this.familyNames = this.familyNames.slice(0, -2);
			})
			.catch(error => {
				this.message = error.response.data.message;
			});
		},
    },
    mounted() {
        this.getPeopleForFamily(this.family.fam_ID)
        if (process.env.NODE_ENV === "development") {
            this.path = "http://localhost:8080/api/images";
        } else {
            this.path = "/api/images";
        }
    }
};
</script>

<style>

</style>