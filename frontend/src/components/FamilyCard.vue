<template>
	<v-card class="family">
        <v-img
        v-if="family.fam_pic"
        :src="path + family.fam_pic"
        height="220"
        cover
        :alt="`The ${family.fam_name} family`"
        ></v-img>

        <v-card-title class="family-title">
        {{ family.fam_name }}
        </v-card-title>

        <ul v-if="people.length" class="family-people">
            <li v-for="person in people" :key="person.per_ID">
                <PersonAvatar :name="`${person.frst_name} ${person.last_name || ''}`" :color-key="familyKey(family.fam_ID)" :size="40" />
                {{ person.frst_name }}
            </li>
        </ul>

        <dl class="family-facts">
            <template v-if="family.fam_email">
                <dt><v-icon icon="mdi-email" size="20" /><span class="sr-only">Email</span></dt>
                <dd><a :href="`mailto:${family.fam_email}`">{{ family.fam_email }}</a></dd>
            </template>
            <template v-if="family.fam_phone">
                <dt><v-icon icon="mdi-phone" size="20" /><span class="sr-only">Phone</span></dt>
                <dd><a :href="`tel:${family.fam_phone}`">{{ family.fam_phone }}</a></dd>
            </template>
            <template v-if="family.fam_address">
                <dt><v-icon icon="mdi-home" size="20" /><span class="sr-only">Address</span></dt>
                <dd>{{ family.fam_address }}</dd>
            </template>
        </dl>

        <v-card-actions v-if="canEdit" class="family-actions">
        <v-btn
            @click="editFamily(family)"
            variant="tonal"
            color="primary"
            prepend-icon="mdi-pencil"
        >
        Edit family
        </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import FamilyPersonService from "../services/FamilyPersonService";
import PersonAvatar from "./PersonAvatar.vue";
import { familyKey } from "../familyKeys";

export default {
	name: 'Families-List',
    components: { PersonAvatar },
    props: ['family'],
    data() {
        return {
            familyPersons: [],
            path: ""
            
        };
    },
    computed: {
        people() {
            return this.familyPersons
                .filter(familyPerson => familyPerson.person)
                .map(familyPerson => familyPerson.person);
        },
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
        },
        // Moderators and admins can edit any family; other users only their own
        canEdit() {
            if (this.showModeratorBoard || this.showAdminBoard) {
                return true;
            }
            const per_ID = this.currentUser && this.currentUser.per_ID;
            return !!per_ID && this.familyPersons.some(familyPerson => familyPerson.per_ID == per_ID);
        }
    },
    
	methods: {
        familyKey,

		editFamily(family) {
            this.$router.push({ name: 'familyedit', params: { id: family.fam_ID } });
        },

        getPeopleForFamily(fam_ID)  {
			FamilyPersonService.getFamilyPersons(fam_ID)
			.then(response => {
				this.familyPersons = response.data;
			})
			.catch(error => {
				this.message = (error.response && error.response.data.message) || error.message;
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

<style scoped>
.family {
    height: 100%;
    display: flex;
    flex-direction: column;
}
.family-title {
    font-weight: 700;
    font-size: 1.375rem;
    padding: 20px 20px 4px;
}
.family-people {
    list-style: none;
    margin: 0;
    padding: 8px 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px 18px;
}
.family-people li {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 700;
}
.family-facts {
    margin: 0;
    padding: 8px 20px 4px;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 8px 12px;
    color: var(--ink-muted);
}
.family-facts dt {
    color: var(--ink-muted);
}
.family-facts dd {
    margin: 0;
    overflow-wrap: anywhere;
}
.family-actions {
    margin-top: auto;
    padding: 12px 16px 16px;
}
</style>