<template>
    <!-- Edits the parent form's person (and contact list) in place -->
    <!-- eslint-disable vue/no-mutating-props -->
    <div>
        <v-card>
            <v-form v-model="validEmail">
                <v-data-table
                :headers="emailheaders"
                :items="emails"
                hide-default-footer
                >
                <template v-slot:[`item.primary`]="{ item }">
                        <v-radio-group
                        v-model="person.email">
                        <div class="d-flex justify-center"><v-radio :value="item.communication.address"/></div>
                        </v-radio-group>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon
                        @click="deleteEmail(item)"
                    >
                        mdi-delete
                    </v-icon>
                </template>
                <template v-slot:[`body.append`]>
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
                            <v-btn :disabled="!validEmail" size="small" @click="addEmail()" >
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
                    <template v-slot:[`item.primary`]="{ item }">
                        <v-radio-group
                        v-model="person.phone">
                        <div class="d-flex justify-center"><v-radio :value="item.communication.number"/></div>
                        </v-radio-group>
                    </template>
                    <template v-slot:[`item.actions`]="{ item }">
                        <v-icon
                            @click="deletePhone(item)"
                        >
                            mdi-delete
                        </v-icon>
                    </template>
                    <template v-slot:[`body.append`]>
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
                                <v-btn :disabled="!validPhone" size="small" @click="addPhone()" >
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
            <v-form v-model="validAddress">
                <v-data-table
                :headers="addressheaders"
                :items="addresses"
                hide-default-footer
                >
                    <template v-slot:[`item.primary`]="{ item }">
                        <v-radio-group
                        v-model="person.address">
                        <div class="d-flex justify-center"><v-radio :value="item.communication.address"/></div>
                        </v-radio-group>
                    </template>
                    <template v-slot:[`item.actions`]="{ item }">
                        <v-icon
                            @click="deleteAddress(item)"
                        >
                            mdi-delete
                        </v-icon>
                    </template>
                    <template v-slot:[`body.append`]>
                        <tr>
                            <td>
                                <v-text-field
                                v-model="currentAddress.address"
                                :rules="addressRules"
                                label="Street Address"
                                required
                                ></v-text-field>
                            </td>
                            <td center>
                                <v-btn :disabled="!validAddress" size="small" @click="addAddress()" >
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
            validAddress: false,
            emailRules: [
                v => !!v || 'E-mail is required',
                v => /^\S{1,}@\S{2,}\.\S{2,}$/.test(v) || 'E-mail must be valid',
            ],
            // Any usual format (555-0101, (405) 555-0101, +1 405.555.0101) with 7 to 15 digits
            phoneRules: [
                v => !!v || 'Phone number is required.',
                v => (/^[0-9+().\s-]+$/.test(v || '') && /^\d{7,15}$/.test((v || '').replace(/\D/g, ''))) || 'Enter a valid phone number',
            ],
            addressRules: [
                v => !!v || 'Address is required.'
            ],

            emailheaders: [
                        {
                            title: 'Email Address',
                            align: 'left',
                            value: 'communication.address',
                            sortable: false,
                        },
                        {
                            title: 'Primary',
                            align: 'center',
                            value: 'primary',
                            sortable: false,
                        },
                        {
                            title: 'Action',
                            align: 'center',
                            value: 'actions',
                            sortable: false,
                        }
                    ],
            phoneheaders: [
                        {
                            title: 'Phone Number',
                            align: 'left',
                            value: 'communication.number',
                            sortable: false,
                        },
                        {
                            title: 'Primary',
                            align: 'center',
                            value: 'primary',
                            sortable: false,
                        },
                        {
                            title: 'Action',
                            align: 'center',
                            value: 'actions',
                            sortable: false,
                        }
                    ],
            addressheaders: [
                        {
                            title: 'Street Address',
                            align: 'left',
                            value: 'communication.address',
                            sortable: false,
                        },
                        {
                            title: 'Primary',
                            align: 'center',
                            value: 'primary',
                            sortable: false,
                        },
                        {
                            title: 'Action',
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
        // Remove the contact link and the email/phone/address it points to,
        // then drop it from the list shown on screen
        deleteContact(personcontact, list) {
            PersonContactService.delete(personcontact.cpc_ID)
            .then(() => {
                this[list] = this[list].filter(contact => contact.cpc_ID != personcontact.cpc_ID);
                return CommunicationService.delete(personcontact.com_ID);
            })
            .catch(error => {
                this.message = (error.response && error.response.data.message) || error.message;
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
            this.deleteContact(personcontact, 'emails');
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
            this.deleteContact(personcontact, 'phones');
        },
        addAddress() {
            this.currentAddress.vvg_ID = 1;
            this.currentAddress.vve_ID = 3;
            this.currentAddress.number = 0;
            CommunicationService.create(this.currentAddress)
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
                    this.currentAddress = {};
                })
                .catch(e => {
                    console.log(e);
                });
        },
        deleteAddress(personcontact) {
            this.deleteContact(personcontact, 'addresses');
        },
    },
    mounted() {
        this.getPersonContacts(this.person.per_ID);
    }
};
</script>

<style>

</style>