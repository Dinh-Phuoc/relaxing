'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { NormalizedMovie } from '~/types/movie';

interface MovieCardProps {
    movie: NormalizedMovie;
}

export default function MovieCard({ movie }: MovieCardProps) {
    const [hovered, setHovered] = useState(false);
    const [imgError, setImgError] = useState(false);

    const episodeBadge = movie.currentEpisode ?? (movie.type === 'movie' ? null : null);

    return (
        <Link href={`/movie/${movie.slug}?source=${movie.source}`} style={{ display: 'block', textDecoration: 'none', flexShrink: 0, width: '100%' }}>
            <div
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{ cursor: 'pointer' }}
            >
                {/* Poster */}
                <div style={{
                    position: 'relative',
                    aspectRatio: '2/3',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: '#1a1a2e',
                    transform: hovered ? 'scale(1.03)' : 'scale(1)',
                    boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.6)' : '0 2px 8px rgba(0,0,0,0.3)',
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                    marginBottom: '8px',
                }}>
                    {!imgError ? (
                        <Image
                            src={movie.poster || movie.thumb || '/placeholder.jpg'}
                            alt={movie.title}
                            fill
                            style={{ objectFit: 'cover' }}
                            sizes="(max-width: 768px) 150px, 180px"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111' }}>
                            <Play size={28} color="#e50914" />
                        </div>
                    )}

                    {/* Dark overlay on hover */}
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: hovered ? 'rgba(0,0,0,0.3)' : 'transparent',
                        transition: 'background 0.25s ease',
                    }} />

                    {/* Play icon on hover */}
                    {hovered && (
                        <div style={{
                            position: 'absolute', top: '50%', left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '44px', height: '44px', borderRadius: '50%',
                            background: 'rgba(229,9,20,0.9)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 0 20px rgba(229,9,20,0.5)',
                        }}>
                            <Play size={18} color="white" fill="white" style={{ marginLeft: '2px' }} />
                        </div>
                    )}

                    {/* Quality badge — top left */}
                    {movie.quality && (
                        <div style={{ position: 'absolute', top: '6px', left: '6px', display: 'flex', gap: '3px' }}>
                            <span style={{ background: 'rgba(229,9,20,0.92)', color: 'white', fontSize: '9px', fontWeight: 700, padding: '2px 5px', borderRadius: '3px', letterSpacing: '0.3px' }}>
                                {movie.quality}
                            </span>
                            {movie.type === 'anime' && (
                                <span style={{ background: 'rgba(99,102,241,0.92)', color: 'white', fontSize: '9px', fontWeight: 700, padding: '2px 5px', borderRadius: '3px' }}>
                                    ANIME
                                </span>
                            )}
                        </div>
                    )}

                    {/* Episode badge — top right */}
                    {episodeBadge && (
                        <div style={{ position: 'absolute', top: '6px', right: '6px' }}>
                            <span style={{
                                background: 'rgba(0,0,0,0.8)', color: '#e0e0e0',
                                fontSize: '9px', fontWeight: 600, padding: '2px 5px', borderRadius: '3px',
                                backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.1)',
                                whiteSpace: 'nowrap', maxWidth: '70px', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block',
                            }}>
                                {episodeBadge}
                            </span>
                        </div>
                    )}

                    {/* Bottom gradient + year */}
                    <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
                        padding: '20px 8px 6px',
                    }}>
                        {movie.year && (
                            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px' }}>{movie.year}</span>
                        )}
                    </div>
                </div>

                {/* Title below card */}
                <p style={{
                    color: hovered ? '#ffffff' : '#c0c0d0',
                    fontSize: '12px',
                    fontWeight: 500,
                    lineHeight: '1.4',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical' as const,
                    transition: 'color 0.2s',
                    minHeight: '32px',
                }}>
                    {movie.title}
                </p>
            </div>
        </Link>
    );
}
