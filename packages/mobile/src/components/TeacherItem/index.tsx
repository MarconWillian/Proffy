import React, { useState } from 'react';
import { View, Image, Text, Linking } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';

import heartOutlineIcon from '../../assets/images/icons/heart-outline.png';
import unfavoriteIcon from '../../assets/images/icons/unfavorite.png';
import whatsappIcon from '../../assets/images/icons/whatsapp.png';
import api from '@proffy/api';

import styles from './styles';

export interface Teacher {
    id: number;
    user_id: number;
    avatar: string;
    bio: string;
    cost: number;
    name: string;
    subject: string;
    whatsapp: string;
}
interface TeacherItemProps {
    teacher: Teacher,
    favorited: Boolean
}

const TeacherItem: React.FunctionComponent<TeacherItemProps> = ({teacher, favorited}) => {
    const [isFavorited, setIsFavorited] = useState(favorited);

    function handleLinkToWhatsapp(){
        api.post('connections', {
            user_id: teacher.id
        })
        Linking.openURL(`whatsapp://send?phone=55${teacher.whatsapp}`)
    }
    
    async function handleToggleFavorite(){
        const favorites = await AsyncStorage.getItem('favorites');

        let favoritesArray = [];
        if(favorites){
            favoritesArray = JSON.parse(favorites)
        }

        if(isFavorited){
            favoritesArray = favoritesArray.filter((teacherItem: Teacher) => teacher.id !== teacherItem.id);

            setIsFavorited(false);
        } else {
            favoritesArray.push(teacher);

            setIsFavorited(true);
        }
        await AsyncStorage.setItem('favorites', JSON.stringify(favoritesArray));
    }
    return (
        <View style={styles.container}>
            <View style={styles.profile}>
                <Image 
                    style={styles.avatar}
                    source={{uri: teacher.avatar}}
                />

                <View style={styles.profileInfo}>
                    <Text style={styles.name}>{teacher.name}</Text>
                    <Text style={styles.subject}>{teacher.subject}</Text>
                </View>
            </View>

            <Text style={styles.bio} >
                {teacher.bio}
            </Text>

            <View style={styles.footer}>
                <Text style={styles.price}>
                    Preço/hora {'   '}
                    <Text style={styles.priceValue}>R$ {teacher.cost}</Text>
                </Text>

                <View style={styles.buttonsContainer}>
                    <RectButton 
                        onPress={handleToggleFavorite}
                        style={[
                            styles.favoriteButton, 
                            isFavorited && styles.favored
                        ]}
                    >
                        { isFavorited 
                            ? <Image source={unfavoriteIcon} /> 
                            : <Image source={heartOutlineIcon} />
                        }
                    </RectButton>

                    <RectButton style={styles.contactButton} onPress={handleLinkToWhatsapp}>
                        <Image source={whatsappIcon} />
                        <Text style={styles.contactButtonText}>Entrar em Contato</Text>
                    </RectButton>
                </View>        
            </View>
        </View>
    )
}

export default TeacherItem;