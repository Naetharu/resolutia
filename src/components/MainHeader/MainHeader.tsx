import { Burger, Container, Group, Header, Text, createStyles, rem } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks";
import { Link } from "@tanstack/react-location";

const useStyles = createStyles((theme) => ({

    header: {
        backgroundColor: theme.fn.variant({ variant: "filled", color: theme.primaryColor }).background,
        borderBottom: 0
    },

    container: {
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: rem(70),
        marginLeft: theme.spacing.xl,
        marginRight: theme.spacing.xl,
    },

    brand: {
        fontSize: rem(50),
        color: theme.colors.orange[2]
    },

    links: {
        [theme.fn.smallerThan('md')]: {
            display: 'none'
        },
    },

    Link: {
        fontSize: theme.fontSizes.xl,
        color: theme.colors.orange[2],
        margin: theme.spacing.xl
    },

    burger: {
        [theme.fn.largerThan('md')]: {
            display: 'none'
        }
    }

}))

interface HeaderSearchProps {
    links: { to: string, text: string }[];
}

const MainHeader = ({ links }: HeaderSearchProps) => {
    const [opened, { toggle }] = useDisclosure(false)
    const { classes } = useStyles();
    const items = links.map((link) => {
        return <Link to={link.to} className={classes.Link}>{link.text}</Link>
    });

    return (
        <Header
            height={70}
            className={classes.header}
        >
            <Container className={classes.container} size={2400}>
                {/* LOGO & BRAND */}
                <Text className={classes.brand}>Resolutia</Text>
                <Group className={classes.links}>
                    {items}
                </Group>
                <Burger
                    opened={opened}
                    onClick={toggle}
                    size="lg"
                    className={classes.burger}
                />
            </Container>

        </Header>
    )
}

export default MainHeader