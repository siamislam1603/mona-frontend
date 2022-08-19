import axios from 'axios'
import React, { useEffect } from 'react'
import { BASE_URL } from '../components/App'

const SearchResult = (props) => {
  const queryParams = new URLSearchParams(window.location.search)
  let term = queryParams.get("query")
  // const location = queryParams.get("query")

  const GlobalSearch = async() =>{
    let token = localStorage.getItem('token');
    const response  = await axios.get(`${BASE_URL}/globalSearch/?search=${term}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    console.log("Search value",response)  
  }
  useEffect(() =>{
    GlobalSearch()
  },[term])

  return (
    <div>SearchResult</div>
  )
}

export default SearchResult