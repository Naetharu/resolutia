import { Button, Input, Text, Title } from '@mantine/core'
import { Link } from '@tanstack/react-location'
import { useState } from 'react'

type FormDataType = {
    1: string
    2: number,
    3: number,
}

const Create = () => {

    const [formStage, setFormStage] = useState(1)
    const [formData, setFormData] = useState<FormDataType>({ 1: "tbc", 2: 0, 3: 0 });
    const [inputValue, setInputValue] = useState("")
    const [goalComplete, setGoalComplete] = useState(false)

    const questions: { [key: number]: string } = {
        1: "Give a name to your goal",
        2: "How difficult is your goal on a scale of 1 to 5?",
        3: "How long in days do you wish to work toward this goal?",
    }

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setFormData({ ...formData, [formStage]: inputValue })
        setFormStage(formStage + 1);
        setInputValue('')
    }

    const handleConfirm = () => {
        localStorage.setItem('formData', JSON.stringify(formData))
        setInputValue('')
        setGoalComplete(true)
    }

    const handleClear = () => {
        setFormData({ 1: "tbc", 2: 0, 3: 0 });
        setFormStage(1);
        setInputValue('')
    }

    return (
        <>
            <Link to='/'>Home</Link>

            {goalComplete ? (<Text>COMPLETE</Text>) :

                questions[formStage] ?
                    <form onSubmit={handleSubmit}>
                        <Text>{questions[formStage]}</Text>
                        <Input value={inputValue} onChange={(event) => setInputValue(event.currentTarget.value)} />
                        <Button type='submit'>SUBMIT</Button>
                    </form>

                    :

                    <>
                        <Title>Goal Created</Title>
                        <Text>{formData[1]}</Text>
                        <Text>{formData[2]}</Text>
                        <Text>{formData[3]}</Text>
                        <Button onClick={handleConfirm}>CONFIRM GOAL</Button>
                        <Button onClick={handleClear}>CANCEL GOAL</Button>
                    </>
            }
        </>
    )
}

export default Create
