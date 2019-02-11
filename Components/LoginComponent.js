import React, { Component } from 'React';
import { View, StyleSheet, Button } from 'react-native';
import {Card, Icon, FormInput, CheckBox} from 'react-native-elements';
import { SecureStore } from 'expo';

class Login extends Component{
    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: '',
            remember: false
        }
    }
    componentDidMount(){
        SecureStore.getItemAsync('userinfo')
            .then((userdata) => {
                let userinfo = JSON.parse(userdata);
                if(userinfo){
                    this.setState({username: userinfo.username});
                    this.setState({password: userinfo.password});
                    this.setState({remember: userinfo.remember});
                }
            })
    };
    handleLogin(){
        console.log(JSON.stringify(this.state));
        if(this.state.remember){
            SecureStore.setItemAsync(
                'userinfo',
                JSON.stringify({
                    username: this.state.username,
                    password: this.state.password
                })
            )
            .catch((error) => console.log('Could Not Save userinfo', error));
        }
        else{
            SecureStore.deleteItemAsync('userinfo')
                .catch((error) => console.log('Could Not Delete userinfo', error));
        }
    }
    static navigationOptions = {
        title: 'Login'
    };
    render(){
        return(
            <View style={styles.container}>
                <FormInput
                    placeholder='Username'
                    leftIcon={{ type: 'font-awesome', name: 'user-o'}}
                    onChangeText={(username) => this.setState({username})}
                    value={this.state.username}
                    containerStyle={styles.FormInput}
                />
                <FormInput
                    placeholder='Password'
                    leftIcon={{ type: 'font-awesome', name: 'key'}}
                    onChangeText={(password) => this.setState({password})}
                    value={this.state.password}
                    containerStyle={styles.FormInput}
                />
                <CheckBox
                    title="Remeber Me"
                    center
                    checked={this.state.remember}
                    onPress={() => this.setState({remember: !this.state.remember})}
                    containerStyle={styles.formCheckbox}
                />
                <View style={styles.formButton}>
                    <Button
                        onPress={() => this.handleLogin()}
                        title="Login"
                        color="#512DA8"
                    />
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        margin: 20
    },
    FormInput: {
        margin: 40
    },
    formCheckbox: {
        margin: 40,
        backgroundColor: null
    },
    formButton: {
        margin: 60
    }
});

export default Login;