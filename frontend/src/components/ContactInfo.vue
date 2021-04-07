<template>
    <div>
        <v-card>
            <v-form v-model="validEmail">
                <v-data-table
                :headers="emailheaders"
                :items="emails"
                hide-default-footer
                >
                <template v-slot:item.actions="{ item }">
                    <v-icon
                        @click="deleteEmail(item)"
                    >
                        mdi-delete
                    </v-icon>
                </template>
                <template v-slot:body.append>
                    <tr>
                        <td>
                            <v-text-field
                            v-model="currentEmail.address"
                            :rules="emailRules"
                            label="Email Address"
                            required
                            ></v-text-field>
                        </td>
                        <td center>
                            <v-btn :disabled="!validEmail" small @click="addEmail()" >
                            Add
                            </v-btn>
                        </td>
                    </tr>
                </template>
                </v-data-table>
            </v-form>
        </v-card>
        <v-divider></v-divider>
        <v-card>
            <v-form v-model="validPhone">
                <v-data-table
                :headers="phoneheaders"
                :items="phones"
                hide-default-footer
                >
                    <template v-slot:item.actions="{ item }">
                        <v-icon
                            @click="deletePhone(item)"
                        >
                            mdi-delete
                        </v-icon>
                    </template>
                    <template v-slot:body.append>
                        <tr>
                            <td>
                                <v-text-field
                                v-model="currentPhone.number"
                                :rules="phoneRules"
                                label="Phone Number"
                                required
                                ></v-text-field>
                            </td>
                            <td center>
                                <v-btn :disabled="!validPhone" small @click="addPhone()" >
                                Add
                                </v-btn>
                            </td>
                        </tr>
                    </template>
                </v-data-table>
            </v-form>
        </v-card>
    </div>
</template>

<script>
import CommunicationService from "../services/CommunicationService";
import PersonContactService from "../services/PersonContactService";

export default {
	name: 'ContactInfo',
    props: ['person'],
    data() {
        return {
            personContacts: [],
            emails: [],
            phones: [],
            addresses: [],
            currentEmail: {},
            currentPhone: {},
            currentAddress: {},
            validEmail: false,
            validPhone: false,
            emailRules: [
                v => !!v || 'E-mail is required',
                v => /.+@.+/.test(v) || 'E-mail must be valid',
            ],
            phoneRules: [
                v => !!v || 'Phone number is required.',
                v => (v || '').length == 10 || 'Phone number must be 10 digits',
                v => /(?:\d{1}\s)?\(?(\d{3})\)?-?\s?(\d{3})-?\s?(\d{4})/g.test(v) || 'Phone number must be correct format'
            ],

            emailheaders: [
                        {
                            text: 'Email Address',
                            align: 'left',
                            value: 'communication.address',
                            sortable: false,
                        },
                        {
                            text: 'Action',
                            align: 'center',
                            value: 'actions',
                            sortable: false,
                        }
                    ],
            phoneheaders: [
                        {
                            text: 'Phone Number',
                            align: 'left',
                            value: 'communication.number',
                            sortable: false,
                        },
                        {
                            text: 'Action',
                            align: 'center',
                            value: 'actions',
                            sortable: false,
                        }
                    ],
            
        };
    },
    
	methods: {

		getPersonContacts(per_ID) {
        PersonContactService.getAll(per_ID)
            .then(response => {
                this.personContacts = response.data;
                this.emails = this.personContacts.filter(personContact => personContact.communication.vvg_ID == 1 & personContact.communication.vve_ID == 1);
                this.phones = this.personContacts.filter(personContact => personContact.communication.vvg_ID == 1 & personContact.communication.vve_ID == 2);
                this.addresses = this.personContacts.filter(personContact => personContact.communication.vvg_ID == 1 & personContact.communication.vve_ID == 3);
            })
            .catch(e => {
                console.log(e);
            });
        },
        addEmail() {
            this.currentEmail.vvg_ID = 1;
            this.currentEmail.vve_ID = 1;
            this.currentEmail.number = 0;
            CommunicationService.create(this.currentEmail)
                .then(response => {
                    let personContact = {com_ID : response.data.com_ID, per_ID : this.person.per_ID};
                    PersonContactService.create(personContact)
                    .then(response => {
                        console.log(response.data);
                        this.getPersonContacts(this.person.per_ID);
                    })
                    .catch(e => {
                        console.log(e);
                    });
                    console.log(response.data);
                    this.currentEmail = {};
                })
                .catch(e => {
                    console.log(e);
                });
        },
        deleteEmail(personcontact) {
            PersonContactService.delete(personcontact.cpc_ID)
            .then(() => {  
                this.emails = this.emails.filter(email => email.cpc_ID!=personcontact.cpc_ID);
            })
            .catch(error => {
                this.message = error.response.data.message;
            });
        },
        addPhone() {
            this.currentPhone.vvg_ID = 1;
            this.currentPhone.vve_ID = 2;
            this.currentPhone.address = "";
            CommunicationService.create(this.currentPhone)
                .then(response => {
                    let personContact = {com_ID : response.data.com_ID, per_ID : this.person.per_ID};
                    PersonContactService.create(personContact)
                    .then(response => {
                        console.log(response.data);
                        this.getPersonContacts(this.person.per_ID);
                    })
                    .catch(e => {
                        console.log(e);
                    });
                    console.log(response.data);
                    this.currentPhone = {};
                })
                .catch(e => {
                    console.log(e);
                }); 
        },
        deletePhone(personcontact) {
            PersonContactService.delete(personcontact.cpc_ID)
            .then(() => {  
                this.personContacts = this.personContacts.filter(personContact => personContact.cpc_ID!=personcontact.cpc_ID);
                CommunicationService.delete(personcontact.com_ID)
                .then(() => {  
                })
                .catch(error => {
                    this.message = error.response.data.message;
                });
            })
            .catch(error => {
                this.message = error.response.data.message;
            });
        },
    },
    mounted() {
        this.getPersonContacts(this.person.per_ID);
    }
};
</script>

<style>

</style>