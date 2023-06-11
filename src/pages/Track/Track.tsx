import { Text, Title, createStyles } from '@mantine/core';
import { Link } from '@tanstack/react-location';
import React from 'react'
import MainNav from '../../components/MainNav/MainNav';



const Track = () => {


    // 1 STYLES
    const useStyles = createStyles((theme) => ({

    }))

    const { classes } = useStyles()

    // 2 DATA LOADING
    const item = localStorage.getItem("formData")
    const data = item ? JSON.parse(item) : null;

    // OTHER
    const noData = (
        <>
            <Text>Looks like you've not make any resolutions yet.</Text>
            <Link to='/create'>Why not make one now?</Link>
        </>
    )

    const mainPage = (
        <>
            <Title>{data["1"]}</Title>
            <Text>{data["2"]}</Text>
            <Text>{data["3"]}</Text>
        </>

    )

    return (
        <div >
            <MainNav />
            {!data ? noData : mainPage}
        </div>
    );
}

export default Track