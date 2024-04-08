import {IconButton, Menu, MenuItem, Paper, PaperProps, Typography} from '@mui/material';
import {styled, useTheme} from '@mui/material/styles';
import {observer} from 'mobx-react-lite';
import React, {useEffect, useRef, useState} from 'react';
import Store from '../../store';
import {IHero} from '../../types';
import HeroAvatar from './HeroAvatar';
import {Workspaces} from '@mui/icons-material';

const StyledHeroListItem = styled(Paper)<PaperProps>(({theme}) => ({
    background: theme.palette.common.white,
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(9),
    [theme.breakpoints.up('sm')]: {
        display: 'flex',
        gap: theme.spacing(4),
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        minHeight: theme.spacing(17.5),
        height: theme.spacing(17.5),
    },
    [theme.breakpoints.down('sm')]: {
        display: 'grid',
        gridTemplateAreas: `
        "hero-avatar hero-name"
        "hero-avatar hero-type"
        "hero-description hero-description"
        `,
        paddingBlock: theme.spacing(4),
        columnGap: theme.spacing(6),
        gridTemplateColumns: `${theme.spacing(11.5)} 1fr`,
        gridTemplateRows: `${theme.spacing(5.75)} ${theme.spacing(5.75)} 1fr`,
        minHeight: theme.spacing(27),
        height: theme.spacing(27),
        '&>:last-child': {
            marginTop: theme.spacing(2),
        },
    },
}));

const HeroListItem: React.FC<{ hero: IHero }> = ({hero}) => {
    const theme = useTheme();
    const listItemRef = useRef<HTMLDivElement>(null);
    const [openItemContextMenu, setOpenItemContextMenu] = useState<boolean>(false);
    const [mouseOver, setMouseOver] = useState<boolean>(false);
    const handleHoverStart = () => {
        setMouseOver(true);
    };
    const handleHoverFinish = () => {
        setMouseOver(false);
    };
    useEffect(() => {
        if (Store.selectedHeroId === hero.id) {
            Store.setSelectedHero('');
            if (listItemRef.current) {
                listItemRef.current.scrollIntoView({
                    behavior: 'smooth',
                    inline: 'center',
                    block: 'center',
                });

            }
        }
    }, [hero]);

    function handleListItemAction(action: string) {
        switch (action) {
            case 'delete':
                const confirmationSuccess = window.confirm('Are you sure you want to delete this character?')
                if (confirmationSuccess) {
                    Store.deleteHero(hero);
                }
                break
            case 'update':
                Store.modals.updateCharacter(hero)
                break
        }
        setOpenItemContextMenu(false)
    }

    return (
        <>
            <StyledHeroListItem
                id={`hero-list-item-${hero.id}`}
                ref={listItemRef}
                elevation={mouseOver ? 3 : 0}
                onMouseEnter={handleHoverStart}
                onMouseLeave={handleHoverFinish}
                onTouchStart={handleHoverStart}
                onTouchEnd={handleHoverFinish}
                onClick={(e) => {

                    if (e.currentTarget === listItemRef.current)
                        Store.showHeroDetails(hero.id);
                }}
            >
                <HeroAvatar
                    src={hero.avatarUrl}
                    alt={`${hero.fullName} avatar`}
                    height={theme.spacing(11.25)}
                    width={theme.spacing(11.25)}
                    mr={5}
                    gridArea={'hero-avatar'}
                />
                <Typography
                    variant={'body1'}
                    fontWeight={'bolder'}
                    flex={4}
                    whiteSpace={'nowrap'}
                    overflow={'hidden'}
                    textOverflow={'ellipsis'}
                    gridArea={'hero-name'}
                >
                    {hero.fullName}
                </Typography>
                <Typography
                    variant={'body1'}
                    flex={3}
                    whiteSpace={'nowrap'}
                    overflow={'hidden'}
                    textOverflow={'ellipsis'}
                    gridArea={'hero-type'}
                >
                    {hero.type.name}
                </Typography>
                <Typography
                    variant={'body1'}
                    flex={4}
                    whiteSpace={'nowrap'}
                    overflow={'hidden'}
                    textOverflow={'ellipsis'}
                    gridArea={'hero-description'}
                >
                    {hero.description}
                </Typography>

                <IconButton sx={{
                    transition: 'transform 400ms ease-in-out',
                    '&:hover': {
                        transform: 'rotate(120deg)',
                    }
                }}
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setOpenItemContextMenu(true)
                            }}
                >
                    <Workspaces/>
                </IconButton>

            </StyledHeroListItem>
            <Menu open={openItemContextMenu}
                  anchorEl={listItemRef.current}
                  onClose={() => {
                      setOpenItemContextMenu(false)
                  }}
                  anchorOrigin={{horizontal: 'right', vertical: "center"}}>
                <MenuItem onClick={() => handleListItemAction('delete')}>Delete</MenuItem>
                <MenuItem onClick={() => handleListItemAction('update')}>Update
                </MenuItem>
            </Menu>
        </>
    );
};

export default observer(HeroListItem);
