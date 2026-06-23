'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Star, Clock } from 'lucide-react';
import { NormalizedMovie } from '~/types/movie';

interface MovieCardProps {
    movie: NormalizedMovie;
    size?: 'sm' | 'md' | 'lg';
}

export default function MovieCard({ movie, size = 'md' }: MovieCardProps) {
    const [hovered, setHovered] = useState(false);
    const [imgError, setImgError] = useState(false);

    return (
        <Link
            href={`/movie/${movie.slug}?source=${movie.source}`}
            style={{ display: 'block', textDecoration: 'none' }}
        >
            <div
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{
                    position: 'relative',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    background: '#1a1a2e',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    transform: hovered ? 'scale(1.04) translateY(-4px)' : 'scale(1)',
                    boxShadow: hovered ? '0 20px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(229,9,20,0.3)' : '0 4px 12px rgba(0,0,0,0.3)',
                    cursor: 'pointer',
                    width: '100%',
                    aspectRatio: '2/3',
                }}
            >
                {/* Poster */}
                <div style={{ position: 'absolute', inset: 0 }}>
                    {!imgError ? (
                        <Image
                            src={movie.poster || movie.thumb || '/placeholder.jpg'}
                            alt={movie.title}
                            fill
                            style={{ objectFit: 'cover' }}
                            sizes="(max-width: 768px) 50vw, 200px"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #1a1a2e, #0d0d20)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Play size={32} color="#e50914" />
                        </div>
                    )}
                </div>

                {/* Overlay */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: hovered
                        ? 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.2) 100%)'
                        : 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)',
                    transition: 'all 0.3s ease',
                }} />

                {/* Top badges */}
                <div style={{ position: 'absolute', top: '8px', left: '8px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {movie.quality && (
                        <span style={{ background: 'rgba(229,9,20,0.9)', color: 'white', fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', letterSpacing: '0.5px' }}>
                            {movie.quality}
                        </span>
                    )}
                    {movie.type === 'anime' && (
                        <span style={{ background: 'rgba(99,102,241,0.9)', color: 'white', fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' }}>
                            ANIME
                        </span>
                    )}
                </div>

                {movie.currentEpisode && (
                    <div style={{ position: 'absolute', top: '8px', right: '8px' }}>
                        <span style={{ background: 'rgba(0,0,0,0.75)', color: '#a0a0b0', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', backdropFilter: 'blur(4px)' }}>
                            {movie.currentEpisode}
                        </span>
                    </div>
                )}

                {/* Play button */}
                {hovered && (
                    <div style={{
                        position: 'absolute', top: '50%', left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '48px', height: '48px', borderRadius: '50%',
                        background: 'rgba(229,9,20,0.9)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 0 20px rgba(229,9,20,0.5)',
                    }}>
                        <Play size={20} color="white" fill="white" style={{ marginLeft: '2px' }} />
                    </div>
                )}

                {/* Bottom info */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px' }}>
                    <h3 style={{
                        color: 'white', fontSize: '13px', fontWeight: 600,
                        lineHeight: '1.3', marginBottom: '4px',
                        overflow: 'hidden', display: '-webkit-box',
                        WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                    }}>
                        {movie.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {movie.year && <span style={{ color: '#a0a0b0', fontSize: '11px' }}>{movie.year}</span>}
                        {movie.rating && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#f5c518', fontSize: '11px' }}>
                                <Star size={10} fill="#f5c518" /> {movie.rating.toFixed(1)}
                            </span>
                        )}
                        {movie.duration && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#606070', fontSize: '11px' }}>
                                <Clock size={10} /> {movie.duration}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}
