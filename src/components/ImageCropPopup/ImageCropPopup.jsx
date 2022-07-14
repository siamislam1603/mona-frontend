import React, { useState, useEffect } from 'react';
import getCroppedImg from '../../utils/ImageCropper';
import Cropper from 'react-easy-crop';
import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/Button';
import './ImageCropPopup.css';

const ImageCropPopup = ({ image, setCroppedImage, setPopupVisible }) => {

    const [croppedArea, setCroppedArea] = useState(null);
    const [tempImage, setTempImage] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);

    const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
        console.log(croppedAreaPercentage, croppedAreaPixels);
        setCroppedArea(croppedAreaPixels);
    };

    const onImageCrop = async () => {
        let croppedImageCanvas = await getCroppedImg(tempImage, croppedArea);
        let croppedImage = convertCanvasToImg(croppedImageCanvas);

        setCroppedImage(croppedImage);
        setPopupVisible(false);
    }

    const convertCanvasToImg = (canvas) => {
        let img = new Image();
        img.src = canvas.toDataURL();
        return img;
    };

    useEffect(() => {
        console.log('IMAGE:', image && image[0]);
        if(image && image.length > 0) {
            const reader = new FileReader();
            reader.readAsDataURL(image[0]);
            reader.addEventListener('load', () => {
                setTempImage(reader.result);
            });
        }
    }, [image])

    return (
        <div className="popup-container">
            <div className="popup">
                <div className="container-cropper">
                    <div className="cropper">
                        <Cropper 
                            image={tempImage}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete} />
                    </div>

                    <div className="slider">
                        <Slider 
                            min={1} 
                            max={3}
                            step={0.1}
                            value={zoom}
                            color="secondary"
                            onChange={(e, zoom) => setZoom(zoom)} />
                    </div>
                </div>

                <div className="container-buttons">
                    <Button variant="contained" color="primary" className="me-3">
                      Cancel
                    </Button>
                    <Button variant="contained" color="primary" onClick={onImageCrop}>
                      Save Image
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ImageCropPopup;