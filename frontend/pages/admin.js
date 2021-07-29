import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Head from 'next/head'
import styles from '../styles/admin.module.css'
//import useSWR, { mutate } from 'swr'
import Navbar from "../components/navbar";
import withAuth from "../components/withAuth";


const URL = "http://localhost/api/pets";
const URL2 = "http://localhost/api/income";


const fetcher = url => axios.get(url).then(res => res.data)
const SWR1 = () => {
    const [pets, setPets] = useState({ list: [{ id: 1, name: "Baby powder", amount: 1,  price: 25 },] })
    const [pet, setPet] = useState({})
    const [id, setId] = useState(0)
    const [name, setname] = useState('')
    const [amount,setamount] = useState(0)
    const [price, setPrice] = useState(0)
    const [income, setIncome] = useState(0)

    //const { data } = useSWR(URL, URL2, fetcher)


    useEffect(() => {
        getPets();
        getIncome();
        profileUser();
      }, []);

    const profileUser = async () => {
        try {
          // console.log('token: ', token)
          const users = await axios.get(`${config.URL}/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          // console.log('user: ', users.data)
          setUser(users.data);
        } catch (e) {
          console.log(e);
        }
      };
    
    const getPets = async () => {
        let pets = await axios.get(URL)
        setPets(pets.data)
        //console.log('Pet:', pets.data)
    }
    const getIncome = async () => {
        let income = await axios.get(URL2)
        setIncome(income.data)
        //console.log('income:', income.data)
    }

    const getPet = async (id) => {
        let pet = await axios.get(`${URL}/${id}`)
        console.log('bear id: ', pet.data)
        setPet({ id: pet.data.id, name: pet.data.name, amount: pet.data.amount,  price: pet.data.price })
    }



    const printPets = () => {
        if (pets && pets.length)
            return pets.map((pet, index) =>
                <li className={styles.listItem} key={index}>
                    <h6>Id:{(pet) ? pet.id : 0}</h6>
                    <h6>name:{(pet) ? pet.name : '-'}</h6>
                    <h6>amount:{(pet) ? pet.amount : 0}</h6>
                    Price:{(pet) ? pet.price : 0}
                    <button className={styles.byttondelet} onClick={() => deletePet(pet.id)} >Delete</button>
                    <button className={styles.byttonget} onClick={() => getPet(pet.id)}>Get</button>
                    <button className={styles.byttonupdate} onClick={() => updatePet(pet.id)}>Update</button>
                </li>
            )
        else
            return <li> ไม่มีสินค้า </li>
    }

    const printIncome = () => {
        return income
    }


    const addPet = async ( name, amount, price) => {
        let pets = await axios.post(URL, {  name, amount, price })
        setPets(pets.data)
    }


    const deletePet = async (id) => {
        const result = await axios.delete(`${URL}/${id}`)
        console.log(result.data)
        getPets()
    }

    const updatePet = async (id) => {
        const result = await axios.put(`${URL}/${id}`, { id, name, amount, price })
        //console.log('student id update: ', result.data)
        getPets()
    }



    return (<div className={styles.container} >
          <Navbar />
        <h1>Admin</h1>
        <h2>Income:{printIncome()}</h2>
        <h2>Littelpig Shop</h2>
        <ul className={styles.list}  >{printPets()}</ul>
        selected order: {pet.name} {pet.amount}  {pet.price}
        <h2>Add Order</h2>
        <ul className={styles.formadd} >
            name:<input type="text" onChange={(e) => setname(e.target.value)} /> <br />
        amount:<input type="number" onChange={(e) => setamount(e.target.value)} /> <br />
        Price:<input type="number" onChange={(e) => setPrice(e.target.value)} /> <br />
            <button className={styles.byttonadd} onClick={() => addPet(name, amount, price)}>Add new order</button>
        </ul>
    </div>
    )
}

export default withAuth(SWR1);

export function getServerSideProps({ req, res }) {
    return { props: { token: req.cookies.token || "" } };
  }
