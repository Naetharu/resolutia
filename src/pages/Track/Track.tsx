import { Box, Button, Text, Title, createStyles } from '@mantine/core';
import { Link } from '@tanstack/react-location';
import MainNav from '../../components/MainNav/MainNav';
import { resolutionDataType } from '../../types';
import { deleteFromLocalStorage } from '../../helpers/handleLocalstorage';



const Track = () => {
    // 1 STYLES
    const useStyles = createStyles((theme) => ({
        pageContainer: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        },

        justifyRight: {
            display: 'flex',
            justifyContent: 'flex-end'
        },

        justifyCenter: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
        },

        resolutionCard: {
            width: '600px',
            height: '140px',
            margin: theme.spacing.xl,
            backgroundColor: '#EFEFEF',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: theme.spacing.md
        }
    }))
    const { classes } = useStyles()

    // 2 DATA LOADING
    const item = localStorage.getItem("resolutionData")
    const data = item ? JSON.parse(item) : null;

    // 3 Functions
    const handleDeleteResolution = (resolution: string) => {
        deleteFromLocalStorage(resolution)
    }

    // 4 JSX
    return (
        <div className={classes.pageContainer}>
            <MainNav />
            {!data ?
                <>
                    <Text>Looks like you've not make any resolutions yet.</Text>
                    <Link to='/create'>Why not make one now?</Link>
                </>
                :
                <>
                    {
                        data.map((resolution: resolutionDataType) => (
                            <Box className={classes.resolutionCard} key={resolution.resolutionName}>
                                <Box className={classes.justifyRight}>
                                    <Button onClick={() => handleDeleteResolution(resolution.resolutionName)}>Delete</Button>
                                </Box>
                                <Box className={classes.justifyCenter}>
                                    <Title order={2}>{resolution.resolutionName}</Title>
                                    <Text>Difficulty: {resolution.resolutionDifficulty}</Text>
                                    <Text>Duration: {resolution.resolutionDuration}</Text>
                                </Box>
                            </Box>
                        ))
                    }
                </>
            }
        </div>
    );
}

export default Track