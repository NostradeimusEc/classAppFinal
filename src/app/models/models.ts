export interface Curso {
    name: string;
    seccion: string;
    image: string;
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
