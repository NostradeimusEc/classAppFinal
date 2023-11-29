export interface Curso {
    name: string;
    seccion: string;
    image: string;
    sala: string;
    id: string;
    userId: string[];
}

export interface User{
    uid: string,
    email: string,
    password: string,
    name: string,
    image: string,
    profile: 'alumno' | 'profesor' | 'admin'
}

