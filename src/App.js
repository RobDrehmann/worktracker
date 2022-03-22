import './App.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import {useState} from 'react';
import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';
if (!firebase.apps.length) {
   firebase.initializeApp({
    apiKey: "AIzaSyAxPIBb_zosWopPJA2TRHpzexyhcdN85Hs",
  authDomain: "worktracker-82a00.firebaseapp.com",
  projectId: "worktracker-82a00",
  storageBucket: "worktracker-82a00.appspot.com",
  messagingSenderId: "261389181945",
  appId: "1:261389181945:web:2a03586aebb24958975328",
  measurementId: "G-3L6E5SQC0H"
   });
}else {
   firebase.app(); // if already initialized, use that one
}
const  auth = firebase.auth();
const firestore = firebase.firestore();


function App() {
const [user] = useAuthState(auth);
const allRef = firestore.collection('AllUsers');


  const signInWithGoogle = () => {

    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  const createuser = async() => {
    const{uid, photoURL, displayName, email} = auth.currentUser;

    await allRef.doc(email).set({

      id:email,
      name: displayName,
      User_name: email,
    

      uid,
      email,



    },{merge:true})    

}

  return (
    <div className="App">
      {user ?<div></div>: <div></div>}

    {user ? 
    <div><Signedin /></div>
      :
      <button onClick={signInWithGoogle}>Sign in with Google</button>
}
    </div>
  );
 
}
function Assignment(props){
  const {nameof, Aid, classof,createdAt, duedate} = props.assignment
  console.log(duedate);  
  const{uid, photoURL, displayName, email} = auth.currentUser;
  const assignRef = firestore.collection(`AllUsers/${email}/assignments`);
  const deleteassignment = async() => {
  await assignRef.doc(Aid).delete().then(() => {
      console.log("Document successfully deleted!");})
  
   }
  
  return(<>
    <div className="Assign">
      <p id="name">{nameof}</p>
      <p>{classof}</p>
      <p>{duedate}</p>
      <button onClick={deleteassignment}>Delete</button>
     </div>
  </>)
}
function Signedin(){
  var Acode;
  const allRef = firestore.collection('AllUsers');
const query = allRef;
const [users] = useCollectionData(query, {idField: 'id'});
const{uid, photoURL, displayName, email} = auth.currentUser;
const assignRef = firestore.collection(`AllUsers/${email}/assignments`);
const Aquery = assignRef.orderBy('createdAt','desc');
const [assignments] = useCollectionData(Aquery, {idField: 'id'});
const [AssignName, setAssignName] = useState('');
const [AssignClass, setAssignClass] = useState('');
const [AssignDate, setAssignDate] = useState('');

  const addAssignment = async(e) => {
    Acode= '_' + Math.random().toString(36).substr(2, 9);
              e.preventDefault();
                    await assignRef.doc(Acode).set({
                        Aid: Acode,
                        duedate: AssignDate,
                        nameof: AssignName,
                        classof: AssignClass,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                      })
                      Acode= '_' + Math.random().toString(36).substr(2, 9);
  
                    }
      
  return(
   
    <div className="Signedin" >
    <h1>Work Tracker</h1>
     <div className="addone">
        <input  placeholder="Assignment Name"onChange={(e) => { setAssignName(e.target.value)}}/>
        <input placeholder="Class" onChange={(e) => { setAssignClass(e.target.value)}}/>
        <input type="date" onChange={(e) => { setAssignDate(e.target.value)}}/>
       
     </div>
     <div className="addone">
     <button onClick={(e) => addAssignment(e)}>Add</button>
     </div>
  
     {assignments && assignments.map(assign => <Assignment key ={assign.id}   assignment={assign}/>)}
     
     
</div>

    
  )
}

export default App;
