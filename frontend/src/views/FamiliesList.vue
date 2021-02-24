<template>
	<v-main>
      <v-container>
		<v-btn
			to="/familyadd"
			class="mx-2"
			fab
			dark
			color="blue darken-4"
		>
			<v-icon dark>
				mdi-plus
			</v-icon>
		</v-btn>
        <v-row>
		<v-col
            v-for="family in families"
            :key="family.fam_ID"
            cols="4"
          >
            <v-card
				class="mx-auto"
				max-width="344"
			>
				<v-img
				src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
				height="200px"
				></v-img>

				<v-card-title>
				{{ family.fam_name}}
				</v-card-title>

				<v-card-subtitle>
				Contact Information
				</v-card-subtitle>

				<v-card-actions>
				<v-btn
				@click="editFamily(family)"
				class="ma-2"
				outlined
				large
				fab
				color="blue darken-4"
				>
				<v-icon>mdi-pencil</v-icon>
				</v-btn>

				<v-spacer></v-spacer>

				
				</v-card-actions>
			</v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
</template>

<script>
import FamilyService from "../services/FamilyService";

export default {
	name: 'Families-List',
    data() {
        return {
            families: {}
            
        };
    },
	created() {
		FamilyService.getFamilies()
            .then(response => {
                this.families = response.data;
                console.log(this.families);
            })
            .catch(error => {
                this.message = error.response.data.message;
            });
	},
	methods: {
		editFamily(family) {
            this.$router.push({ name: 'familyedit', params: { id: family.fam_ID } });
        }
		
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