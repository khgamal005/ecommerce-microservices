import React from 'react';
import Header from './shared/widgets/header/Header';
import Hero from '../components/modules/Hero';
import SectionTitle from '../components/section/section-title';
import SuggestedProducts from '../components/modules/SuggestedProducts';

const page = () => {
  return (
    <>
      <Header />
      <Hero />
      <div className="md-w[80%] w-[90%] my-10 m-auto">
        <div className="mb-8">
          <SectionTitle
            title="Suggested Products"
            variant="gradient"
            subtitle="Discover handpicked items just for you"
          />
        </div>
        <SuggestedProducts />
      </div>
    </>
  );
};

export default page;
