import React, {Component} from 'react';
import { View, Text, ScrollView, FlatList, Modal, Button, TextInput, StyleSheet, Alert, PanResponder } from 'react-native';
import { Card, Icon, Rating } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        favorites: state.favorites
    }
}
const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId))
});
function RenderDish(props){
    const dish = props.dish;
    handleViewRef = ref => this.view = ref;
    const recognizeDrag = ({moveX, moveY, dx, dy}) => {
        if (dx < -200)
            return true;
        else
            return false;
    };
    const recognizeComment = ({moveX, moveY, dx, dy}) => {
        if(dx > 200)
            return true;
        else
            return false;
    }
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (e, gestureState) => {
            return true;
        },
        onPanResponderGrant: () => {
            this.view.rubberBand(1000)
                .then(endState => console.log(endState.finished ? 'Finished' : 'Cancelled'))
        },
        onPanResponderEnd: (e, gestureState) => {
            if (recognizeDrag(gestureState)){
                Alert.alert(
                    'Add Favorite',
                    'Are you sure you wish to add ' + dish.name + ' to favorite?',
                    [
                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                    {text: 'OK', onPress: () => {props.favorite ? console.log('Already favorite') : props.onPress()}},
                    ],
                    { cancelable: false }
                );
            }
            else if(recognizeComment(gestureState)){
                props.toggleModal();
            }
            return true;
        }
    });
    if(dish != null){
        return(
            <Animatable.View animation="fadeInDown" duration={2000} delay={1000} 
            ref={this.handleViewRef}
            {...panResponder.panHandlers}>
                <Card
                featuredTitle={dish.name}
                image={{uri: baseUrl + '/' + dish.image}}>
                    <Text style={{margin: 10}}>
                        {dish.description}
                    </Text>
                    <View style={{flex: 1, flexDirection:'row', justifyContent:'center'}}>
                        <Icon
                            raised
                            reverse
                            name={ props.favorite ? 'heart' : 'heart-o'}
                            type='font-awesome'
                            color='#f50'
                            onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()}
                            />
                        <Icon
                            raised
                            reverse
                            name={'pencil'}
                            type='font-awesome'
                            color='#f50'
                            onPress={() => props.toggleModal()}
                        />
                        <Modal animationType = {"slide"} transparent = {false}
                            visible = {props.showModal}
                            onDismiss = {() => props.toggleModal() }
                            onRequestClose = {() => props.toggleModal()}>
                            <View style={styles.modal}>
                                <Text style={styles.modalTitle}>Your Comment</Text>
                                <Rating
                                    showRating
                                    type="star"
                                    fractions={1}
                                    startingValue={5}
                                    imageSize={40}
                                    style={{ alignItems:"center", margin:40, paddingTop:20, paddingVertical: 10 }}
                                />
                                <TextInput
                                    style={{height: 40}}
                                    placeholder="Author"
                                />
                                <TextInput
                                    style={{height: 40}}
                                    placeholder="Comment"
                                />
                                <Button 
                                    style={{marginBottom: 20}}
                                    onPress = {() => props.toggleModal()}
                                    color="#512DA8"
                                    title="Submit" 
                                />
                                <Button 
                                    onPress = {() => props.toggleModal()}
                                    color="#512DA8"
                                    title="Close" 
                                />
                            </View>
                        </Modal>
                    </View>
                </Card>
            </Animatable.View>
        );
    }
    else{
        return(<View></View>)
    }
}

function RenderComments(props){
    const comments = props.comments;
    const renderCommentItem = ({item, index}) => {
        return(
            <View
                key={index}
                style={{margin: 10}}>
                <Text style={{fontSize: 14}}> {item.comment}</Text>
                <Rating
                    type="star"
                    fractions={1}
                    readonly
                    startingValue={item.rating}
                    imageSize={10}
                    style={{ paddingVertical: 10, paddingLeft: 10 }}
                />
                <Text style={{fontSize: 12}}>
                {'---' + item.author + ', ' + item.date}</Text>
            </View>
        );
    }
    return(
        <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
            <Card title="Comments">
                <FlatList 
                    data= {comments}
                    renderItem={renderCommentItem}
                    keyExtractor={item => item.id.toString()}
                />
            </Card>
        </Animatable.View>
    )
}
class Dishdetail extends Component{
    constructor(props){
        super(props);
        this.state = {
            showModal: false
        }
        this.toggleModal = this.toggleModal.bind(this);
    }
    toggleModal(){
        this.setState({showModal: !this.state.showModal});
    }
    markFavorite(dishId) {
        this.props.postFavorite(dishId)
    }
    static navigationOptions = {
        title: 'Dish Details'
    }
    render(){
        const dishId = this.props.navigation.getParam('dishId', '')
        return(
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onPress={() => this.markFavorite(dishId)}
                    toggleModal={this.toggleModal}
                    showModal={this.state.showModal}
                    />
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
            </ScrollView>

        );
    }
}
const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        margin: 20
     },
     modalTitle: {
         fontSize: 24,
         fontWeight: 'bold',
         backgroundColor: '#512DA8',
         textAlign: 'center',
         color: 'white',
         marginBottom: 20
     }
})
export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);