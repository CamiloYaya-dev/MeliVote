import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function CreateBoard() {
    const [numCards, setNumCards] = useState(5);
    const [ownerVotes, setOwnerVotes] = useState(false);
    const [autoClose, setAutoClose] = useState(true);
    const [votes, setVotes] = useState([]);

    const defaultScores = [0.5, 1, 2, 3, 5, 8, 13, 21, 34];
    const randomNames = ["MAX", "LEO", "ZOE", "LIA", "KAI", "SAM", "TOM", "LUC", "EVA", "NIA"];

    const cards = Array.from({ length: numCards }, (_, i) => ({
        id: i,
        value: defaultScores[i % defaultScores.length],
    }));

    const getRandomVote = () => cards[Math.floor(Math.random() * cards.length)].value;
    const getRandomName = (usedNames) => {
        let name;
        do {
            name = randomNames[Math.floor(Math.random() * randomNames.length)];
        } while (usedNames.includes(name));
        return name;
    };

    useEffect(() => {
        if (votes.length === 0) {
            const usedNames = [];
            const newVotes = Array.from({ length: 4 }, () => {
                const name = getRandomName(usedNames);
                usedNames.push(name);
                return { id: name, value: getRandomVote() };
            });

            setVotes(newVotes);
        }
    }, [numCards]);

    useEffect(() => {
        setVotes((prevVotes) => {
            if (ownerVotes) {
                if (!prevVotes.some((vote) => vote.id === "👑 OWN")) {
                    return [...prevVotes, { id: "👑 OWN", value: getRandomVote() }];
                }
            } else {
                return prevVotes.filter((vote) => vote.id !== "👑 OWN");
            }
            return prevVotes;
        });
    }, [ownerVotes]);

    return (
        <div style={styles.container}>
            {/* 1️⃣ Elegir cantidad de cartas */}
            <h2 style={styles.title}>🃏 Crear Tablero</h2>
            <p style={styles.subtitle}>Selecciona la cantidad de cartas:</p>

            <input
                type="number"
                min="2"
                max={defaultScores.length}
                value={numCards}
                onChange={(e) => setNumCards(Number(e.target.value))}
                style={styles.input}
            />

            {/* 2️⃣ Previsualización de cartas */}
            <h3 style={styles.sectionTitle}>Previsualización de cartas</h3>
            <div style={styles.previewContainer}>
                <AnimatePresence>
                    {cards.map((card) => (
                        <motion.div
                            key={card.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                            style={styles.card}
                        >
                            {card.value}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* 3️⃣ Pregunta si el dueño vota */}
            <div style={styles.checkboxContainer}>
                <label>
                    <input
                        type="checkbox"
                        checked={ownerVotes}
                        onChange={() => setOwnerVotes(!ownerVotes)}
                    />
                    &nbsp; ¿El dueño del tablero vota?
                </label>
            </div>

            {/* 4️⃣ Previsualización de votación */}
            <h3 style={styles.sectionTitle}>Previsualización de votación</h3>
            <div style={styles.previewContainer}>
                <AnimatePresence mode="sync">
                    {votes.map((vote) => (
                        <motion.div
                            key={vote.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            style={{
                                ...styles.card,
                                backgroundColor: vote.id === "👑 OWN" ? "#28a745" : "#ff9800",
                            }}
                        >
                            {vote.value}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* 5️⃣ Opción de cierre automático */}
            <div style={styles.checkboxContainer}>
                <label>
                    <input
                        type="checkbox"
                        checked={autoClose}
                        onChange={() => setAutoClose(!autoClose)}
                    />
                    &nbsp; ¿Cierre de votación automático?
                </label>
            </div>

            {/* 6️⃣ Previsualización de la visibilidad de resultados */}
            <h3 style={styles.sectionTitle}>Previsualización de resultados</h3>
            <div style={styles.previewContainer}>
                {autoClose ? (
                    <Results votes={votes} />
                ) : (
                    <HiddenResults />
                )}
            </div>
        </div>
    );
}

const Results = ({ votes }) => (
    <AnimatePresence mode="sync">
        {votes.map((vote) => (
            <motion.div
                key={vote.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                style={{
                    ...styles.card,
                    backgroundColor: vote.id === "👑 OWN" ? "#28a745" : "#ff9800",
                }}
            >
                {vote.id}: {vote.value}
            </motion.div>
        ))}
    </AnimatePresence>
);

const HiddenResults = () => (
    <AnimatePresence mode="wait">
        <motion.div
            key="hidden-results"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={styles.hiddenResults}
        >
            🔒 Resultados ocultos hasta que el dueño los revele
        </motion.div>
    </AnimatePresence>
);

const styles = {
    container: {
        padding: "20px",
        background: "#fff",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
        width: "400px",
        margin: "auto",
    },
    title: {
        fontSize: "24px",
        fontWeight: "bold",
        marginBottom: "10px",
    },
    sectionTitle: {
        fontSize: "18px",
        fontWeight: "bold",
        marginTop: "20px",
        color: "#444",
    },
    input: {
        padding: "8px",
        fontSize: "16px",
        borderRadius: "5px",
        border: "1px solid #ccc",
        width: "100px",
        textAlign: "center",
    },
    checkboxContainer: {
        marginTop: "15px",
        fontSize: "16px",
        color: "#444",
        textAlign: "center",
    },
    previewContainer: {
        display: "flex",
        justifyContent: "center",
        gap: "10px",
        marginTop: "10px",
        flexWrap: "wrap",
    },
    card: {
        width: "50px",
        height: "70px",
        backgroundColor: "#007bff",
        color: "white",
        fontSize: "14px",
        fontWeight: "bold",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "5px",
        boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.2)",
    },
    hiddenResults: {
        width: "200px",
        height: "70px",
        backgroundColor: "#ccc",
        color: "#444",
        fontSize: "14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "5px",
    },
    resultsContainer: {
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "10px",
        marginTop: "10px",
    },
};
