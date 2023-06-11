import { Button, NumberInput, Text, TextInput, Title, createStyles } from '@mantine/core'

import MainNav from '../../components/MainNav/MainNav'
import { useForm } from '@mantine/form'
import { saveToLocalStorage } from '../../helpers/handleLocalstorage'

import { useState } from 'react'


const Create = () => {

    // #1 Styles
    const useStyles = createStyles((theme) => ({
        page: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: "center",
            minHeight: '80vh',
        },
        content: {
            marginTop: '100px'
        },
        input: {
            padding: theme.spacing.lg,
            minWidth: '400px',
            fontSize: theme.fontSizes.xl
        },
        button: {
            marginTop: theme.spacing.xl,
            fontSize: theme.fontSizes.xl
        },
        text: {
            margin: theme.spacing.lg
        },
        textContainer: {
            display: 'flex',
            flexDirection: 'column',
        },
        spanText: {
            fontWeight: 'bold'
        }
    }))

    const { classes } = useStyles()

    // #2 Functions
    const form = useForm({
        initialValues: {
            resolutionName: '',
            resolutionDifficulty: 3,
            resolutionDuration: 90,
        }
    })

    const [resolutionCreated, setResolutionCreated] = useState(false)

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        console.log(form.values)
        saveToLocalStorage(form.values)
        setResolutionCreated(true)
    }

    const handleCreateAnother = () => {
        setResolutionCreated(false);
    }

    // #3 JSX
    return (
        <div className={classes.page}>

            <MainNav />
            {!resolutionCreated ?
                <div className={classes.content}>
                    <form onSubmit={handleSubmit}>

                        <TextInput
                            className={classes.input}
                            withAsterisk
                            label="Resolution Name"
                            placeholder="..."
                            {...form.getInputProps('resolutionName')}
                        />

                        <NumberInput
                            className={classes.input}
                            withAsterisk
                            label="Resolution Difficulty"
                            defaultValue={3}
                            min={1}
                            max={5}
                            placeholder="Difficulty of your Resolution"
                            {...form.getInputProps('resolutionDifficulty')}
                        />

                        <NumberInput
                            className={classes.input}
                            withAsterisk
                            label="Resolution Duration"
                            defaultValue={90}
                            min={7}
                            max={365}
                            placeholder="Number of days to maintain your Resolution"
                            {...form.getInputProps('resolutionDuration')}
                        />

                        <Button disabled={!form.values.resolutionName} className={classes.button} type='submit'>SUBMIT</Button>
                    </form>
                </div>
                :
                <div className={classes.content}>
                    <Title>Resolution Created</Title>
                    <div className={classes.textContainer}>
                        <Text className={classes.text}><span className={classes.spanText}>Name: </span> {form.values.resolutionName}</Text>
                        <Text className={classes.text}><span className={classes.spanText}>Difficulty: </span>{form.values.resolutionDifficulty}</Text>
                        <Text className={classes.text}><span className={classes.spanText}>Duration: </span> {form.values.resolutionDuration}</Text>
                    </div>
                    <Button onClick={handleCreateAnother}>Create Another?</Button>
                </div>
            }
        </div>
    )
}

export default Create
