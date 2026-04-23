import { useState } from 'react';

const Accordion = ({ steps }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    // Jika yang diklik sudah terbuka, maka tutup (null). Jika belum, buka index tersebut.
    setOpenIndex(openIndex === index ? null : index);
  };

  if (!steps || steps.length === 0) return <p>Belum ada langkah-langkah.</p>;

  return (
    <div className="accordion-container">
      <h4 style={{ marginBottom: '10px' }}>Langkah-langkah:</h4>
      {steps.map((step, index) => (
        <div key={index} className="accordion-item">
          <button 
            className="accordion-header" 
            onClick={() => toggleAccordion(index)}
          >
            <span>Langkah {index + 1}</span>
            <span>{openIndex === index ? '▲' : '▼'}</span>
          </button>
          
          <div className={`accordion-content ${openIndex === index ? 'expanded' : ''}`}>
            <p style={{ margin: 0 }}>{step}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Accordion;