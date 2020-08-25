import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Button,
  Image,
  Platform,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import Permissions from 'react-native-permissions';
import Scanner, {RectangleOverlay} from 'react-native-rectangle-scanner';
import {Icon} from 'react-native-elements';
import ImageEditor from './ImageEditor';
import ImageCropper from './ImageCropper';

function DocumentScanner({navigation}) {
  const scanner = useRef(null);
  const [data, setData] = useState({});
  const [allowed, setAllowed] = useState(false);
  const [lastDetectionType, setLastDetectionType] = useState('');
  const [stableCounter, setStableCounter] = useState('');
  const [showScannerView, setShowScannerView] = useState(false);
  const [device, setDevice] = useState({
    initialized: false,
    hasCamera: false,
    permissionToUseCamera: false,
    flashIsAvailable: false,
    previewHeightPercent: 1,
    previewWidthPercent: 1,
  });
  const [loadingCamera, setLoadingCamera] = useState(false);
  const [processingImage, setProcessingImage] = useState(false);
  const [detectedRectangle, setDetectedRectangle] = useState({});

  useEffect(() => {
    async function requestCamera() {
      const result = await Permissions.request(
        Platform.OS === 'android'
          ? 'android.permission.CAMERA'
          : 'ios.permission.CAMERA',
      );
      if (result === 'granted') {
        setAllowed(true);
      }
    }
    requestCamera();
  }, []);

  function handleOnPressRetry() {
    setData({});
  }

  function handleOnPress() {
    scanner.current.capture();
  }
  if (!allowed) {
    console.log('You must accept camera permission');
    return (
      <View style={styles.permissions}>
        <Text>You must accept camera permission</Text>
      </View>
    );
  }
  if (data.initialImage) {
    console.log('data', data);
    console.log(detectedRectangle);
    navigation.navigate('Image Cropper', {
      imageParam: data.initialImage,
      rectangleCoordinates: detectedRectangle,
    });
  }

  function renderDetectionType() {
    switch (lastDetectionType) {
      case 0:
        return 'Correctly formatted receipt found';
      case 1:
        return 'Bad angle found';
      case 2:
        return 'Rectangle too far';
      default:
        return 'No receipt detected yet';
    }
  }

  // Hides the camera view. If the camera view was shown and onDeviceSetup was called,
  // but no camera was found, it will not uninitialize the camera state.
  function turnOffCamera(shouldUninitializeCamera = false) {
    if (shouldUninitializeCamera && device.initialized) {
      setShowScannerView(false);
      setDevice({...device, initialized: false});
    } else if (showScannerView) {
      setShowScannerView(false);
    }
  }

  // Will show the camera view which will setup the camera and start it.
  // Expect the onDeviceSetup callback to be called
  function turnOnCamera() {
    if (!showScannerView) {
      setShowScannerView(true);
      setLoadingCamera(true);
    }
  }

  function renderCameraView() {
    if (this.state.showScannerView) {
      const previewSize = this.getPreviewSize();
      let rectangleOverlay = null;
      if (!loadingCamera && !processingImage) {
        rectangleOverlay = (
          <RectangleOverlay
            detectedRectangle={detectedRectangle}
            previewRatio={previewSize}
            backgroundColor="rgba(255,181,6, 0.2)"
            borderColor="rgb(255,181,6)"
            borderWidth={4}
            allowDetection={false}
          />
        );
      }
    }
  }

  return (
    <>
      <Text>Receipt Scanner</Text>
      <Scanner
        useBase64={false}
        ref={scanner}
        style={styles.scanner}
        onPictureTaken={setData}
        overlayColor="rgba(255, 130, 0, 0.7)"
        enableTorch={false}
        capturedQuality={0.5}
        manualOnly={true}
        onRectangleDetected={({detectedRectangle}) =>
          setDetectedRectangle(detectedRectangle)
        }
        detectionCountBeforeCapture={5000000}
        detectionRefreshRateInMs={5000}
      />
      <View style={styles.cameraButton}>
        <Icon
          reverse
          name="ios-camera"
          type="ionicon"
          color="#00BED2"
          onPress={handleOnPress}
        />
      </View>
      <Text style={styles.instructions}>
        🧾 Align your receipt with the overlay and tap the camera button.
      </Text>
      <Text style={styles.instructions}>{renderDetectionType()}</Text>
    </>
  );
}

const styles = StyleSheet.create({
  scanner: {
    flex: 1,
    aspectRatio: undefined,
  },
  button: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: 32,
  },
  buttonText: {
    backgroundColor: 'rgba(245, 252, 255, 0.7)',
    fontSize: 32,
  },
  preview: {
    flex: 1,
    width: '100%',
    resizeMode: 'cover',
  },
  permissions: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DocumentScanner;
