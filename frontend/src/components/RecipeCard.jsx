import Accordion from './Accordion';

const RecipeCard = ({ recipe }) => {
  return (
    <div className="card">
      <h3 style={{ marginTop: 0, color: 'var(--emerald-pine)' }}>{recipe.title}</h3>
      
      <div>
        <span className="badge">{recipe.category}</span>
        <span className="badge" style={{ marginLeft: '8px', backgroundColor: '#eee', color: '#333' }}>
          {recipe.difficulty}
        </span>
      </div>

      <div style={{ marginTop: '15px' }}>
        <h4>Bahan-bahan:</h4>
        <ul style={{ paddingLeft: '20px', margin: '10px 0' }}>
          {recipe.ingredients.map((bahan, index) => (
            <li key={index}>{bahan}</li>
          ))}
        </ul>
      </div>

      {/* Memanggil komponen Accordion untuk langkah-langkah */}
      <Accordion steps={recipe.steps} />
    </div>
  );
};

export default RecipeCard;