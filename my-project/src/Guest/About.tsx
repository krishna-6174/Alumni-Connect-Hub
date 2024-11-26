// About.js
import { Container } from '@mui/material';
import React from 'react';

const About = () => {
  return (
    <Container maxWidth="md" className="m-10 mx-auto p-6  ">
      <h1 className="text-3xl font-semibold text-center mb-6">About Us</h1>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <img
          src="/image.png" // Image path from the public folder
          alt="College Building"
          className="w-full h-auto object-cover"
        />
        <div className="p-6">
          <p className="text-lg">
            <strong>Geethanjali College of Engineering & Technology</strong> has been structured to take head on the changing trends of technology...
          </p>
          <p className="text-justify"><strong>Geethanjali College of Engineering &amp; Technology</strong> has been structured to take head on the changing trends of technology. The idea of setting up the college emerged when no other college could cater to the needs of a student in his/her endeavor to acquire wholesome education. The very strength of Geethanjali lies in its principles of providing the right learning environment for the student who does not have to compromise throughout the learning process of becoming global citizen.</p>
          <p className="text-justify">The college recognizes that the rapidly changing technological landscape would require young technocrats with an understanding of evolving technologies, but also with a global perspective. A major goal of Geethanjali is to impart a uniquely broad and interdisciplinary Engineering education of the highest academic quality. This is achieved through an integrated curriculum that consists of a highly diverse set of technical courses, interdisciplinary research projects, day-to-day interaction with industry, and preparation in entrepreneurship and personality development courses.</p>
          <p className="text-justify">At Geethanjali learning pushes all boundaries of conventional thought in pursuit of understanding science in relation to the society. Every concept a Geethanjalite acquires carries the inbuilt awareness of how it can be applied to render human life better.</p>
          <p className="text-justify">Over the years since it was established, there has been dynamic progress at Geethanjali in all academic and research activities, and a parallel improvement in facilities and infrastructure, to keep it on par with the best institutions in India. The campus epitomizes the Geethanjali motto,"Striving towards perfection" in providing the best of infrastructure and ambience. Geethanjali keeps a keen eye on the current trends and innovations happening in the industry and offers learning methods, which are designed to meet the evolving requirements of the industry.</p>
        </div>
      </div>
    </Container>
  
  );
};

export default About;
