let language = {
    en: {
        // language of login page(en)
        login:{
            //for welcome section
            welcome:{
                header: "Welcome to petition submission service",
                paragrraph: "Fill in username and password\nto enter the petition",
            },

            //for form section
            form:{
                header: "Login petition submission"
            }
        },

        // language of sidebar(en)
        sidebar: {
            header: "Thammasat University",

            //for anchor link section
            link:{
                personalInfo: "Personal information",
                requestForm: "Request form",
                requestStatus: "Request status",
                logout: "Logout"
            }
           
        },

        // language of request form page(en)
        request:{
            header: "Petition Online",
            form: {

                // for personal info section
                personalInfo: {
                    header: "Personal informantion",
                    title: {
                        header: "Title",
                        mr: "Mr.",
                        mrs: "Mrs.",
                        miss: "Miss."
                    },

                    firstName: "First name",
                    LastName: "Last name",
                    
                    educationYear: "Year",

                    faculty: {

                        // chocice of faculty
                        chocice: {
                            header: "Faculty currently studying",
                            law: "Faculty of Law",
                            commerce: "Thammasat Business School",
                            political_science: "Faculty of Political Science",
                            economics: "Faculty of Economics",
                            social_work: "Faculty of Social Administration",
                            journalism: "Faculty of Journalism and Mass Communication",
                            sociology_anthropology: "Faculty of Sociology and Anthropology",
                            puey_ungphakorn: "Puey Ungphakorn School of Development Studies",
                            innovation: "College of Innovation",
                            interdisciplinary: "College of Interdisciplinary Studies",
                            pridi_banomyong: "Pridi Banomyong International College",
                            learning_sciences: "Faculty of Learning Sciences and Education",
                            global_studies: "School of Global Studies",
                            liberal_arts: "Faculty of Liberal Arts",
                            fine_arts: "Faculty of Fine and Applied Arts",
                            science_technology: "Faculty of Science and Technology",
                            engineering: "Faculty of Engineering",
                            architecture: "Faculty of Architecture and Planning",
                            siit: "Sirindhorn International Institute of Technology",
                            medicine: "Faculty of Medicine",
                            dentistry: "Faculty of Dentistry",
                            allied_health_sciences: "Faculty of Allied Health Sciences",
                            nursing: "Faculty of Nursing",
                            public_health: "Faculty of Public Health",
                            pharmacy: "Faculty of Pharmacy",
                            cicm: "Chulabhorn International College of Medicine"
                        }
                    },

                    id: "ID",

                    phone: "Telephone number"
                },
                
                //for addrress section
                location:{
                    header:"Location",

                    houseNo: "House no.",
                    villageNo: "Village no.",
                    subDistrict: "Sub district",
                    district: "District",
                    province: "Province",
                    postolCode: "Postal code"
                },

                //for subject section
                courses:{
                    header:"Courses to add/drop",

                    courseId: "Course ID",
                    courseName: "Course Name",
                    section: "Section",
                    adivisor: "Advisor",
                    reason: "Reasons",
                },

                //for form button
                button:{
                    draft:"Draft",
                    cancel:"Cancel",
                    next: "Next"
                }
            }
        },

        pettition: {
            header: "Check Status",
            
            //status of request
            status: {
                approved: "Approved",
                consider: "Under consideration",
                pending: "Pending",
                doc: "Waiting for additional document",
                reject: "Rejected"
            }
        },

        profile: {
            header: "User information",

            //for user information section
            personalInfo:{
                name: "Name",
                studentId: "Student ID",
                faculty: "Faculty",
                major: "Major", 
            },

            //for request status section
            requestInfo:{
                header:"My Petition",
            }
        }
    }
    
};

// export {language};