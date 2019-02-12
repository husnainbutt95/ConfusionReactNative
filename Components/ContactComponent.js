import React from 'react';
import { Text } from 'react-native';
import { Card, Button, Icon } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import { MailComposer } from 'expo';
class Contact extends React.Component{
    constructor(props){
        super(props);
        this.sendMail = this.sendMail.bind(this);
    }
    sendMail(){
        MailComposer.composeAsync({
            recipients: ['rocking.butt95@gmail.com'],
            subject: 'Inquiry',
            body: 'To whom it may concern'
        });
    }
    static navigationOptions = {
        title : 'Contact'
    }
    render(){
        return(
            <Animatable.View animation="fadeInDown" duration={2000} delay={1000}>
                <Card
                    title='Contact Information'>
                    <Text>121, Clear Water Bay Road</Text>
                    <Text>Clear Water Bay, Kowloon</Text>
                    <Text>HONG KONG</Text>
                    <Text>Tel: +852 1234 5678</Text>
                    <Text>Fax: +852 8765 4321</Text>
                    <Text>Email:confusion@food.net</Text>
                    <Button
                        title="Send Email"
                        buttonStyle={{backgroundColor: "#512DA8"}}
                        icon={<Icon name='envelope-o' type='font-awesome' color='white' />}
                        onPress={this.sendMail}
                    />
                </Card>
            </Animatable.View>
        );
    }
}
export default Contact;