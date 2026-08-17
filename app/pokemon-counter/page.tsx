'use client';

import { useEffect, useState } from 'react';

const TOTAL_POKEMON = 151;
const API_BASE = 'https://pokeapi.co/api/v2/pokemon';
const SPRITE_BASE =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

const spriteUrl = (id: number) => `${SPRITE_BASE}/${id}.png`;

export default function PokemonCounterPage() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState<string | null>(null);

  // 0 clics → #001, y cada clic avanza un Pokémon; al pasar el 151 vuelve al 1
  const pokemonId = (count % TOTAL_POKEMON) + 1;

  useEffect(() => {
    const controller = new AbortController();
    setName(null);

    fetch(`${API_BASE}/${pokemonId}`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setName(data?.name ?? null))
      .catch(() => {
        // sin red o PokeAPI caída: la página sigue funcionando sin el nombre
      });

    // precarga el siguiente sprite para que el cambio sea instantáneo
    new window.Image().src = spriteUrl((pokemonId % TOTAL_POKEMON) + 1);

    return () => controller.abort();
  }, [pokemonId]);

  return (
    <div className="pkc-wrap">
      <header className="pkc-head">
        <div className="pkc-kicker">POKÉDEX · MÓDULO 001</div>
        <h1 className="pkc-title">CONTADOR POKÉMON</h1>
      </header>

      <div className="pkc-machine">
        <div className="pkc-screen">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={pokemonId}
            className="pkc-sprite"
            src={spriteUrl(pokemonId)}
            alt={`Pokémon número ${pokemonId}`}
            width={200}
            height={200}
          />
          <div className="pkc-dexnum">
            N.º {String(pokemonId).padStart(3, '0')}
          </div>
          <div className={`pkc-name${name ? '' : ' loading'}`}>
            {name ?? 'CARGANDO…'}
          </div>
        </div>

        <div className="pkc-panel">
          <div>
            <div className="pkc-count-label">Clics</div>
            <span key={count} className="pkc-count">
              {count}
            </span>
          </div>

          <div className="pkc-actions">
            <button
              className="btn lg yellow"
              onClick={() => setCount((c) => c + 1)}
            >
              + 1
            </button>
            <button
              className="btn ghost"
              onClick={() => setCount(0)}
              disabled={count === 0}
            >
              REINICIAR
            </button>
          </div>
        </div>
      </div>

      <p className="pkc-hint">
        CADA CLIC SUMA UNO Y REVELA EL SIGUIENTE POKÉMON · 151 EN TOTAL
      </p>
    </div>
  );
}
