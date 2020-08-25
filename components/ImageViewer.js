import React, {useEffect} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
} from 'react-native';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/Ionicons';

function ImageViewer({croppedImage, imageWidth, imageHeight, onImageCropped}) {
  const screenWidth = Math.round(Dimensions.get('window').width);
  const screenHeight = Math.round(Dimensions.get('window').height - 100);
  const imageCropped = croppedImage;

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: `data:image/jpg;base64,${imageCropped}`,
          width: responsiveScreenWidth(100),
          height: responsiveScreenHeight(70),
        }}
      />
      <View style={{flex: 1}}>
        <TouchableOpacity
          style={styles.cropButtonTouchable}
          onPress={() => onImageCropped(false)}>
          <Text style={styles.cropButtonLabel}>Back to the Scanner</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'center',
    height: responsiveScreenHeight(100), // 100% of Screen height
    width: responsiveScreenWidth(100), // 100% of Screen width
  },
  cropButtonLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default ImageViewer;
