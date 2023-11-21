export interface Curso {
    nombre: string;
    seccion: string;
    foto: string;
    sala: string;
    id: string;
}

export interface User{
    uid: string,
    email: string,
    password: string,
    name: string,
    profile: 'alumno' | 'profesor' | 'admin'
}

