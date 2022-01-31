<template>
  
  <div class="">
    <div class="api-keys-form">
        <div>
            <Button type="primary" @click="modal1 = true">Add New Exchange Keys</Button>  
        </div>
        <br/>

        <Table border no-data-text="None" :columns="columns7" :data="data6"></Table>
        <Spin size="large" fix v-if="showSpinner"></Spin>
    </div>
    <br>
    <Modal
        title="Add Exchange Keys"
        v-model="modal1"
        :closable="True"
        ok-text="ok"
        cancel-text="Cancel"
        >
       
        <div class="api-keys-form login_right">
            <Form
                ref="formCustom"
                :model="formCustom"
                :rules="ruleCustom"
                :label-width="80"
            >
                <div class="exchange_title">{{ $t("uc.member.addexchangekeys") }}</div>
                <FormItem label="Exchange Name" prop="exchangeName">
                    <Input type="text" v-model="formCustom.exchangeName"></Input>
                </FormItem>
                <FormItem label="Exchange Type" prop="exchange">
                    <Select placeholder="Select" v-model="formCustom.exchange" clearable style="width:200px">
                        <Option v-for="item in exchanges" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="API Key" prop="key">
                    <Input type="text" v-model="formCustom.key"></Input>
                </FormItem>
                <FormItem label="API Secret" prop="secret">
                    <Input type="text" v-model="formCustom.secret"></Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="handleSubmit('formCustom')">Add Keys</Button>
                </FormItem>
            </Form>
        </div>
    </Modal>
  </div>
</template>
<style scoped lang="scss">
.api-keys-form {
  background: #0b1520;
  height: auto;
  width: auto;
  position: relative;
  padding: 3em 3em;
  margin: 1em;
  border-radius: 1em;
  .exchange_title {
    color: #ffff;
    font-size: 2em;
  }
}
</style>

<script>
import $ from "jquery";
import bitsgapInstance from "@/config/axios.js"

    export default {
        data () {
            const validateName = (rule, value, callback) => {
                if (value === '') {
                    return callback(new Error('Exchange name cannot be empty'));
                } else {
                    callback();
                }
            };
            const validateKey = (rule, value, callback) => {
                if (value === '') {
                    return callback(new Error('API secret cannot be empty'));
                } else {
                    callback();
                }
            };
            
            const validateSecret = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('API secret cannot be empty'));
                } else {
                    callback();
                }
            };
            
            return {
                showSpinner: true,
                userId: this.$store.getters.member.id,
                modal1: false,
                keysPresent: false,
                key:'',
                secret:'',
                exchangeName:'',
                exchangeData: '',
                exchanges: [
                    {
                        value: 'binance',
                        label: "Binance Spot"
                    },
                    {
                        value: 'binance-futures',
                        label: "Binance Futures" 
                    }
                ],
                formCustom: {
                    key: '',
                    secret: '',
                    exchangeName:'',
                    exchange:''
                },
                ruleCustom: {
                    exchangeName: [
                        { validator: validateName, trigger: 'blur' }
                    ],
                    key: [
                        { validator: validateKey, trigger: 'blur' }
                    ],
                    secret: [
                        { validator: validateSecret, trigger: 'blur' }
                    ]
                },
                columns7: [
                    {
                        title: 'Name',
                        key: 'exchange_name',
                        render: (h, params) => {
                            return h('div', [
                                h('Icon', {
                                    props: {
                                        type: 'person'
                                    }
                                }),
                                h('strong', params.row.exchange_name)
                            ]);
                        }
                    },
                    {
                        title: 'Key',
                        key: 'key'
                    },
                    {
                        title: 'Secret',
                        key: 'secret'
                    },
                    {
                        title: 'Action',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.show(params.index)
                                        }
                                    }
                                }, 'View'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.deleteKeys(params)
                                            this.remove(params.index)
                                        }
                                    }
                                }, 'Delete')
                            ]);
                        }
                    }
                ],
                data6: [
                    
                ]
            }
        },
        created() {
            bitsgapInstance.get('/exchanges/list?userId='+this.userId)
            .then(response => {
                this.data6 = response.data.result;
                this.showSpinner = false;
                let exchangeDetails = []
                if (this.data6 != []){
                    for (var i = 0, len = this.data6.length; i < len; i++) {
                        let exchange = {}
                        exchange["exchange_id"] = this.data6[i].exchange_id;
                        exchange["exchange_name"] = this.data6[i].exchange_name;
                        exchange["exchange_type"] = this.data6[i].exchange_type;
                        exchangeDetails.push(exchange)
                    }
                }
                this.$store.commit("setExchanges", exchangeDetails)
            }).catch(function (error) {                    
                console.log(error);
            });     
        },
        methods: {
            deleteKeys(params) {
                var paramss = {
                    "exch_name": params.row.exchange_name,
                    "userId": this.userId
                }

                bitsgapInstance.post('/exchanges/delete', paramss)
                .then(response => {
                    console.log(response)
                    this.$Message.success(response.data.message)
                }).catch(function (error) {   
                    console.log(error)   
                    this.$Message.error(error)             
                });
            },

            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Spin.show()
                        var params = {}
                        params["exch_name"] = this.formCustom.exchangeName
                        params["api_key"] = this.formCustom.key
                        params["api_secret"] = this.formCustom.secret
                        params["exchange"] = this.formCustom.exchange
                        params["userId"] = this.userId
                        
                        bitsgapInstance.post('/exchanges/add', params)
                        .then(response => {
                            this.$Spin.hide()
                            if (response.data.status == 401) {
                                this.$Message.error(response.data.message)  
                            } else {
                                this.key = this.formCustom.key
                                this.secret = this.formCustom.secret
                                this.exchangeName = this.formCustom.exchangeName
                                console.log("Add all the data To the state exchanges")
                                this.$Message.success(response.data.message)
                                this.getAllKeys()
                                return this.keysPresent = true
                            }
                        }).catch(function (error) {      
                            this.$Message.error(error)   
                            this.$Spin.hide()          
                        });
                    } else {
                        this.$Message.error('Fail!'); 
                    }
                })
            },
            show (index) {
                this.$Modal.info({
                    title: 'Exchange Info',
                    content: `Name:${this.data6[index].exchange_name}<br> Key：${this.data6[index].key}<br>Secret：${this.data6[index].secret}`,
                    okText: 'OK'
                })
            },
            remove (index) {
                this.data6.splice(index, 1);
            },
            getAllKeys(){         
                bitsgapInstance.get('/exchanges/list?userId='+this.userId)
                .then(response => {
                    this.data6 = response.data.results
                    let exchangeDetails = []
                    if (this.data6 != []){
                        for (var i = 0, len = this.data6.length; i < len; i++) {
                            let exchange = {}
                            exchange["exchange_id"] = this.data6[i].exchange_id;
                            exchange["exchange_name"] = this.data6[i].exchange_name;
                            exchange["exchange_type"] = this.data6[i].exchange_type;
                            exchangeDetails.push(exchange)
                        }
                    }
                    this.$store.commit("setExchanges", exchangeDetails)
                }).catch(function (error) {                    
                    this.$Message.error(error)  
                });
            },
        }
    }
</script>   