import { Injectable, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {


  //================= Base de Datos =================

  constructor(public database: AngularFirestore) { }

  createDoc(data: any, path: string, id: string){
    const collection = this.database.collection(path);
    return collection.doc(id).set(data);
  }

  getDoc(path: string, id: string){
    const collection = this.database.collection(path);
    return collection.doc(id).valueChanges();
  }

  deleteDoc(path: string, id: string){
    const collection = this.database.collection(path);
    return collection.doc(id).delete();
  }

  updateDoc(data: any, path: string, id: string){
    const collection = this.database.collection(path);
    return collection.doc(id).update(data);
  }

  getCollection<tipo>(path: string){
    const collection = this.database.collection<tipo>(path);
    return collection.valueChanges();
  }

  //======= ID Automático ========
  getId() {
    return this.database.createId();
  }

}
