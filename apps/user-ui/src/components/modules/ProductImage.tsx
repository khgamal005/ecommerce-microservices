import ReactImageMagnify from 'react-image-magnify';

const ProductImage = () => {
  return (
    <div style={{ width: '400px' }}>
      <ReactImageMagnify
        {...{
          smallImage: {
            alt: 'Product image',
            isFluidWidth: true,
            src: '/product.jpg',
          },
          largeImage: {
            src: '/product.jpg',
            width: 1200,
            height: 1800,
          },
        }}
      />
    </div>
  );
};

export default ProductImage;
