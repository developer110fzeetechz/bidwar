import { createContext, useContext, useEffect, useState } from "react";
import useAxios from "../helper/useAxios";
import { useAuth } from "./AuthContext";


const projectData = createContext(null)

export const ProjectProvider = ({ children }) => {
    const [auctionData, setAuctionData] = useState([])
    const [selectedAuction, setSelectedAuction] = useState("")
    const [isAuctionStarted, setIsAuctionStarted] = useState(false)
    const {mydetails, userRole}= useAuth()
    
    const project = {
        title: "My Project",
        description: "This is a sample project.",
        technologies: ["React", "Redux", "Node.js"],
        githubLink: "https://github.com/username/projectname",
        liveLink: "https://projectname.com"
    }

    const { fetchData } = useAxios()

    const getData = async () => {
        const { data, status } = await fetchData({
            url: '/api/auction',
            method: 'GET',
        })
        if (status) {
            const _data = data.map((x) => {
                return {
                    label: x.title || "",
                    value: x._id || "",

                }
            })
            console.log({_data})
            // setSelectedAuction(_data[0])
            if(_data.length){
              
                setSelectedAuction(_data[0].value)            
            }
            
            setAuctionData(_data)
        }
        console.log({status})
    }

    useEffect(() => {
        console.log({userRole})
        getData()
    }, [userRole])

    return (
        <projectData.Provider value={{ project,setAuctionData, auctionData, selectedAuction, setSelectedAuction,
        isAuctionStarted, setIsAuctionStarted
         }}>
            {children}
        </projectData.Provider>
    )
}

export const useData = () => {
    const project = useContext(projectData)
    return project
}

