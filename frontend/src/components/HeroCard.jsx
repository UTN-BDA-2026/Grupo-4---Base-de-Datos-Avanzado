const HeroCard = ({ title, description, variant }) => {
    return (
        <div className={`hero-card card-${variant}`}>
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );
};

export default HeroCard;