interface SelectedConversation {
    _id:string;
    opponent:any;
}


module Controller {
    export class MessengerCtrl {

        overlay:boolean;
        conversations = [];
        conversationsHash = {};
        selectedConversation:SelectedConversation = null;
        messages = [];
        textbox = '';
        messagesIdCache;
        showEmojis:boolean;
        debouncedAck:any;

        emojis = [":smile:", ":blush:", ":kissing_heart:", ":hear_no_evil:", ":speak_no_evil:", ":see_no_evil:"];

        constructor(private $filter, private $scope, private $sce, private MessengerService, private $state, private UserService, private $rootScope, private SocketService, private CacheFactory, private basePathRealtime, private UtilityService) {

            this.getConversations();

            $scope.$on('login_success', () => {
                this.registerSocketEvent();
            });
            if (this.$rootScope.authenticated) {
                this.registerSocketEvent();
            }

            this.messagesIdCache = this.CacheFactory.get('messagesId');

            this.debouncedAck =  this.UtilityService.debounce(this.emitAck, 1000, false);

        }

        toTrusted(html_code) {
            return this.$sce.trustAsHtml(this.$filter('emoji')(html_code));
        }

        selectEmoji(item) {
            this.textbox = this.textbox + ' ' + item + ' ';
            this.showEmojis = false;
            angular.element('#chat_box').focus();
        }

        registerSocketEvent() {
            //this.SocketService.offEvent('new_message');
            this.$scope.$on('new_message', (evt, newMessage) => {
                console.log('neWmEssage');
                if(this.$state.params.opponentId === newMessage.conversation_id ) {
                    this.messages.push(newMessage);

                    this.debouncedAck(newMessage.from, newMessage.conversation_id);
                } else {
                    this.conversationsHash[newMessage.conversation_id][this.$rootScope.userID + '_read'] = false;
                }
                console.log('remove cache for:', this.basePathRealtime + '/messages/' + newMessage.conversation_id);
                this.messagesIdCache.remove(this.basePathRealtime + '/messages/' + newMessage.conversation_id);

            });
        }

        // conversationlist
        getConversations() {
            this.MessengerService.getConversations()
                .then(result => {
                    this.conversations = result.data;
                    this.conversations.forEach(element => {
                        this.conversationsHash[element._id] = element;
                        this.UserService.getUser(element['opponent'])
                            .then(result => {
                                element['opponent'] = result.data;
                            });
                    });
                    if (this.$state.params.opponentId) {
                        var con = this.getConversationById(this.$state.params.opponentId);
                        this.select(con);
                    }
                });
        }

        getConversationById(id:string) {
            return this.conversationsHash[id];
        }

        // one single conversation
        getConversation(conversation) {
            return this.MessengerService.getConversation(conversation._id)
                .then(result => {
                    this.messages = result.data;
                });
        }

        // select a conversation to show message content
        select(conversation:SelectedConversation) {
            if (!conversation) {
                return;
            }
            this.selectedConversation = conversation;
            this.getConversation(this.selectedConversation).then(result => {
                // if the clicked conversation is unread, send ack to server
                if(!this.selectedConversation[this.$rootScope.userID + '_read']) {
                    this.emitAck(conversation.opponent._id, conversation._id)
                }
            });
        }

        emitAck(from, conversation_id) {


            console.log('send ack for received message', {from: this.$rootScope.userID, opponent: from, conversation_id: conversation_id});
            setTimeout(() => {
                this.SocketService.emit('message_ack', {from: this.$rootScope.userID, opponent: from, conversation_id: conversation_id});
            }, 200);
            this.conversationsHash[conversation_id][this.$rootScope.userID + '_read'] = true;
        }

        _sendMessage = () => {

            this.textbox = this.textbox.replace(/<\/?[^>]+(>|$)/g, "");

            this.MessengerService.sendMessage(this.textbox, this.selectedConversation._id, this.selectedConversation.opponent._id, this.$rootScope.userID)

                .then(result => {
                    this.messages.push({message: this.textbox, from: this.$rootScope.userID});
                    this.textbox = '';
                    console.info("Msg Success");
                })
                .catch(result => {
                    console.info("Error");
                });
        };

        sendMessage(event) {

            if (event && event.keyCode !== 13) {
                return;
            }
            this._sendMessage();
            event.preventDefault();
        }

        static controllerId:string = "MessengerCtrl";
    }
}
