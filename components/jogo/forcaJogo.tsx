"use client";
import React, { useState } from "react";
import { Play, RotateCcw, Send, XCircle, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

// Lista de palavras
const palavras = [
  "computador","javascript","teclado","internet","monitor",
  "programador","universidade","foguete","cidade","pinguim",
  "girassol","carro","bicicleta","livro","escola",
  "montanha","oceano","planeta","amigo","familia",
  "telefone","janela","ponte","cachorro","gato",
  "floresta","cultura","historia","futebol","praia"
];


// contador das vidas 
const LifeIndicator: React.FC<{ totalLives: number; currentLives: number }> = ({
  totalLives,
  currentLives,
}) => (
  <div className="flex gap-2 items-center">
    <span className="text-[hsl(var(--muted-foreground))] font-medium">Vidas:</span>
    <div className="flex gap-1">
      {Array.from({ length: totalLives }, (_, index) => (
        <div
          key={index}
          className={`w-4 h-4 rounded-full transition-all duration-300 ${
            index < currentLives
              ? "bg-[hsl(var(--life-active))] shadow-[0_2px_10px_hsl(var(--life-active)/0.6)]"
              : "bg-[hsl(var(--life-lost))] opacity-50"
          }`}
        />
      ))}
    </div>
    <span className="text-[hsl(var(--foreground))] font-bold ml-2">
      {currentLives}/{totalLives}
    </span>
  </div>
);

// Mostrar a palavra
const WordDisplay: React.FC<{ word: string[]; isGameActive: boolean }> = ({
  word,
  isGameActive,
}) => {
  if (!isGameActive) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl font-bold text-[hsl(var(--muted-foreground))] mb-4"></div>
        <p className="text-xl text-[hsl(var(--muted-foreground))]">
          Clique em &quot;Começar&quot; para iniciar o jogo!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-3 py-8">
      {word.map((letter, index) => (
        <div
          key={index}
          className={`
            w-12 h-16 bg-card border-2 border-primary/30 rounded-lg 
            flex items-center justify-center text-3xl font-bold
            transition-all duration-300 hover:border-primary/60
            ${
              letter !== "_"
                ? "bg-[linear-gradient(135deg,hsl(var(--primary)),hsl(var(--primary-glow)))] text-[hsl(var(--primary-foreground))] animate-letter-bounce shadow-[0_10px_40px_-10px_hsl(var(--primary)/0.4)]"
                : ""
            }
          `}
        >
          {letter === "_" ? "" : letter}
        </div>
      ))}
    </div>
  );
};

// popUpp de vitoria ou derrota dependendo do caso
const GameNotification: React.FC<{
  type: "win" | "lose" | null;
  word?: string;
  onClose: () => void;
}> = ({ type, word, onClose }) => {
  if (!type) return null;
  const isWin = type === "win";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-slide-in">
      <div
        className={`
        max-w-md mx-4 p-6 rounded-2xl border-2 shadow-2xl animate-slide-in
        ${
          isWin
            ? "bg-[linear-gradient(135deg,hsl(var(--success)),hsl(var(--success-glow)))] border-[hsl(var(--success))] text-[hsl(var(--success-foreground))] shadow-[0_10px_40px_-10px_hsl(var(--success)/0.4)]"
            : "bg-[linear-gradient(135deg,hsl(var(--accent)),hsl(var(--accent-glow)))] border-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] shadow-[0_10px_40px_-10px_hsl(var(--accent)/0.4)]"
          }
      `}
      >
        <div className="text-center">
          <div className="mb-4">
            {isWin ? (
              <Trophy className="w-16 h-16 mx-auto animate-pulse-glow" />
            ) : (
              <XCircle className="w-16 h-16 mx-auto" />
            )}
          </div>
          <h2 className="text-2xl font-bold mb-2">
            {isWin ? "Parabéns!" : "Que pena!"}
          </h2>
          <p className="text-lg mb-4">
            {isWin
              ? `Você acertou a palavra "${word}"!`
              : `A palavra era "${word}"`}
          </p>
          <button
            onClick={onClose}
            className={`
              px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105
              ${
                isWin
                  ? "bg-[hsl(var(--success-foreground))] text-[hsl(var(--success))] hover:bg-[hsl(var(--success-foreground)/0.9)]"
                : "bg-[hsl(var(--destructive-foreground))] text-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive-foreground)/0.9)]"
              }
            `}
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

// ====================== COMPONENTE PRINCIPAL DO JOGAO ======================

export default function Jogo() {
  const [palavraSecreta, setPalavraSecreta] = useState("");
  const [palavraOculta, setPalavraOculta] = useState<string[]>([]);
  const [vidas, setVidas] = useState(6);
  const [jogoAtivo, setJogoAtivo] = useState(false);
  const [letra, setLetra] = useState("");
  const [notification, setNotification] = useState<{
    type: "win" | "lose";
    word: string;
  } | null>(null);
  const [letrasUsadas, setLetrasUsadas] = useState<string[]>([]);

  function iniciarJogo() {
    const sorteio = Math.floor(Math.random() * palavras.length);
    const escolhida = palavras[sorteio].toUpperCase();
    setPalavraSecreta(escolhida);
    setPalavraOculta(Array(escolhida.length).fill("_"));
    setVidas(6);
    setJogoAtivo(true);
    setLetra("");
    setNotification(null);
    setLetrasUsadas([]);
  }

  function reiniciarJogo() {
    setPalavraSecreta("");
    setPalavraOculta([]);
    setVidas(6);
    setJogoAtivo(false);
    setLetra("");
    setNotification(null);
    setLetrasUsadas([]);
  }

  function verificarLetra() {
    if (!letra || !jogoAtivo || letra.length !== 1) return;
    const letraUpper = letra.toUpperCase();

    if (letrasUsadas.includes(letraUpper)) {
      setLetra("");
      return;
    }

    setLetrasUsadas([...letrasUsadas, letraUpper]);
    let acertou = false;
    const novaOculta = [...palavraOculta];

    for (let i = 0; i < palavraSecreta.length; i++) {
      if (palavraSecreta[i] === letraUpper) {
        novaOculta[i] = letraUpper;
        acertou = true;
      }
    }

    if (acertou) {
      setPalavraOculta(novaOculta);
      if (!novaOculta.includes("_")) {
        setNotification({ type: "win", word: palavraSecreta });
        setJogoAtivo(false);
      }
    } else {
      setVidas((v) => {
        const nova = v - 1;
        if (nova <= 0) {
          setNotification({ type: "lose", word: palavraSecreta });
          setJogoAtivo(false);
        }
        return nova;
      });
    }

    setLetra("");
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,hsl(var(--game-bg)),hsl(var(--game-card)))] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-6xl font-bold bg-[linear-gradient(135deg,hsl(var(--primary)),hsl(var(--primary-glow)))] bg-clip-text text-transparent mb-4">
            Jogo da Forca
          </h1>
          <p className="text-xl text-[hsl(var(--muted-foreground))]">
            Descubra a palavra secreta letra por letra!
          </p>
        </div>

        {/* Principal card do jogo */}
        <Card className="bg-[hsl(var(--game-card))/50] backdrop-blur-lg border-[hsl(var(--primary)/0.2)] ">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl text-[hsl(var(--foreground))]">
                Sua Palavra Secreta
              </CardTitle>
              <LifeIndicator totalLives={6} currentLives={vidas} />
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            <WordDisplay word={palavraOculta} isGameActive={jogoAtivo} />

            {/* Inputzinho da letra */}
            {jogoAtivo && (
              <div className="rounded-xl border border-[hsl(var(--primary)/0.1)] bg-[hsl(var(--card)/0.3)] p-6">
                <div className="flex flex-col items-center space-y-4">
                  <label className="text-lg font-medium text-[hsl(var(--foreground))]">
                    Digite uma letra:
                  </label>
                  <div className="flex gap-4 items-center">
                    <Input
                      type="text"
                      maxLength={1}
                      value={letra}
                      onChange={(e) => setLetra(e.target.value.toUpperCase())}
                      className="w-16 h-16 text-center text-2xl font-bold bg-[hsl(var(--input))] border-[hsl(var(--primary)/0.3)] focus:border-[hsl(var(--primary))]"
                      placeholder="?"
                    />
                    <Button
                      onClick={verificarLetra}
                      variant="verify"
                      size="game"
                      disabled={!letra || letra.length !== 1}
                    >
                      <Send className="w-5 h-5" />
                      Verificar
                    </Button>
                  </div>

                  {/* Letras já usadas */}
                  {letrasUsadas.length > 0 && (
                    <div className="text-center">
                      <p className="text-sm text-[hsl(var(--muted-foreground))] mb-2">
                        Letras já usadas:
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {letrasUsadas.map((l, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] rounded text-sm font-mono"
                          >
                            {l}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Botões do jogo, iniciar e tal */}
            <div className="flex gap-4 justify-center">
              <Button
                onClick={iniciarJogo}
                variant="game"
                size="game"
                className="min-w-32"
              >
                <Play className="w-5 h-5" />
                {jogoAtivo ? "Nova Palavra" : "Começar"}
              </Button>
              <Button
                onClick={reiniciarJogo}
                variant="gameSecondary"
                size="game"
                className="min-w-32"
              >
                <RotateCcw className="w-5 h-5" />
                Reiniciar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Informacao de quantas letras tem na palavra */}
        <div className="mt-6 text-center">
          <p className="text-[hsl(var(--muted-foreground))]">
            Palavra atual:{" "}
            {palavraOculta.length > 0
              ? `${palavraOculta.length} letras`
              : "Nenhuma"}
          </p>
        </div>
      </div>

      {/* PopUp de vitória e derrota */}
      <GameNotification
        type={notification?.type || null}
        word={notification?.word}
        onClose={() => setNotification(null)}
      />
    </div>
  );
}