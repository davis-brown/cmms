<template>
  <v-btn
  color="primary"
  @click.native="pdfGeneration">
    Generate <br/> Directory
  </v-btn>
</template>

<script>
import FamilyPersonService from "../services/FamilyPersonService";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts.js";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default ({
    name: "GenerateDirectory",
    props: ['families'],
    data() {
        return {
            path: "",
            doc: [],
            images: {},
            familyMembers: []
            
        };
    },
    created()  {
        console.log(this.families)
        for(let i = 0; i < this.families.length; i++)
            this.getPeopleForFamily(this.families[i].fam_ID, i);
    },
    methods: 
    {
        getPeopleForFamily(fam_ID, index)  {
			FamilyPersonService.getFamilyPersons(fam_ID)
			.then(response => {
				let familyPersons = response.data;
                this.familyMembers[index] = "";
                familyPersons.forEach( familyPerson => {
                    this.familyMembers[index] += familyPerson.person.frst_name + ", ";
                });
                this.familyMembers[index] = this.familyMembers[index].slice(0, -2);
			})
			.catch(error => {
				this.message = error.response.data.message;
			});
		},
        pdfGeneration()  {
            console.log(this.familyMembers)
            this.images.default = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue.js_Logo_2.svg/1200px-Vue.js_Logo_2.svg.png"
            for (let j = 0; j < this.families.length; j++)
            {
                let name = "image-" + j
                this.images[name] = this.path + this.families[j].fam_pic;
            }
            for (let i = 0; i < this.families.length; i++)
            {
                let imageRow = {};
                let nameRow = {};
                let emailRow = {};
                let phoneRow = {};

                if(this.families[i])  {
                    imageRow[0] = "image-" + i;
                    nameRow[0] = this.families[i].fam_name
                    emailRow[0] = "Email: " + this.families[i].fam_email
                    phoneRow[0] = "Phone: " + this.families[i].fam_phone
                }
                else {
                    imageRow[0] = "default";
                    nameRow[0] = "";
                    emailRow[0] = "";
                    phoneRow[0] = "";
                    this.familyMembers[i] = "";
                }
                if(this.families[i + 1])  {
                    let temp = i + 1;
                    imageRow[1] = "image-" + temp;
                    nameRow[1] = this.families[i + 1].fam_name
                    emailRow[1] = "Email: " + this.families[i + 1].fam_email
                    phoneRow[1] = "Phone: " + this.families[i + 1].fam_phone
                }
                else {
                    imageRow[1] = "default";
                    nameRow[1] = "";
                    emailRow[1] = "";
                    phoneRow[1] = "";
                    this.familyMembers[i + 1] = "";
                }
                if(this.families[i + 2])  {
                    let temp = i + 2;
                    imageRow[2] = "image-" + temp;
                    nameRow[2] = this.families[i + 2].fam_name
                    emailRow[2] = "Email: " + this.families[i + 2].fam_email
                    phoneRow[2] = "Phone: " + this.families[i + 2].fam_phone
                } else {
                    imageRow[2] = "default";
                    nameRow[2] = "";
                    emailRow[2] = "";
                    phoneRow[2] = "";
                    this.familyMembers[i + 2] = "";
                }
                console.log(imageRow);  

                let images = {
                    alignment: 'center',
                    columns: [
                        {
                            image: imageRow[0],
                            width: 160,
                            height: 120,
                            margin: [0, 20, 0, 0]
                        },
                        {},
                        {
                            image: imageRow[1], 
                            width: 160,
                            height: 120,
                            margin: [0, 20, 0, 0]
                        },
                        {},
                        {
                            image: imageRow[2], 
                            width: 160,
                            height: 120,
                            margin: [0, 20, 0, 0]
                        }
                    ]
                }
                let names = {
                    fontSize: 18,
                    alignment: 'center',
                    columns: [
                        {
                            text:nameRow[0]
                        },
                        {
                            text:nameRow[1]
                        },
                        {
                            text:nameRow[2]
                        }
                    ]
                }
                let familynames = {
                    fontSize: 12,
                    alignment: 'center',
                    columns: [
                        {
                            text:this.familyMembers[i]
                        },
                        {
                            text:this.familyMembers[i + 1]
                        },
                        {
                            text:this.familyMembers[i + 2]
                        }
                    ]
                } 
                let familyemails = {
                    fontSize: 10,
                    columns: [
                        {
                            text:emailRow[0]
                        },
                        {
                            text:emailRow[1]
                        },
                        {
                            text:emailRow[2]
                        }
                    ]
                }
                let familyphones = {
                    fontSize: 10,
                    columns: [
                        {
                            text:phoneRow[0]
                        },
                        {
                            text:phoneRow[1]
                        },
                        {
                            text:phoneRow[2]
                        }
                    ]
                } 
                this.doc.push(images);
                this.doc.push(names);
                this.doc.push(familynames);
                this.doc.push(familyemails);
                this.doc.push(familyphones);
                console.log(this.doc);
                i+=2
            }
            let background = {
                canvas: [
                    {
                        type: 'rect',
                        x: 20,
                        y: 20,
                        w: 555,
                        h: 800,
                        r: 5,
                        // lineWidth: 10,
                        lineColor: 'black',
                    }
                ]
            }
            
            let pdfContent = {
                background: background,
                content: this.doc,
                images: this.images
            }
            pdfMake.createPdf(pdfContent).open();
            this.doc = [];
            this.images = {};
        }
    },
    mounted() {
        if (process.env.NODE_ENV === "development") {
            this.path = "http://localhost:8080/api/images";
        } else {
            this.path = "/api/images";
        }
    }
})
</script>