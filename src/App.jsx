import {useEffect, useState} from 'react';
import './App.css';
import lottery from "../lottery.js";
import web3 from "../web3.js";


function App() {
    const [players, setPlayers] = useState([]);
    const [manager, setManager] = useState('');
    const [balance, setBalance] = useState('');
    const [value, setValue] = useState('');
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        async function getManager() {
            try {
                const manager = await lottery.methods.manager().call();
                console.log('manager', manager);
                setManager(manager);
            } catch (error) {
                console.error('Error fetching manager:', error);
            }
        }

        async function getPlayers() {
            const players = await lottery.methods.getPlayers().call();
            console.log('players', players);
            setPlayers(players);
        }

        async function getBalance() {
            const balance = await web3.eth.getBalance(lottery.options.address);
            console.log('balance', balance);
            setBalance(web3.utils.fromWei(balance, 'ether'));
        }

        Promise.all([getManager(), getPlayers(), getBalance()])
            .then(() => setIsLoading(false))
            .catch(console.error);
    }, []);

    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            const accounts = await web3.eth.getAccounts();
            setMessage(`Attempting to auth from account from: ${accounts[0]}`);
            await lottery.methods.enter().send({
                from: accounts[0],
                value: web3.utils.toWei(value, 'ether')
            });
            setMessage('Successfully entered lottery');
            setValue('');
            setPlayers(players.concat(accounts[0]));
            setBalance(web3.utils.fromWei(await web3.eth.getBalance(lottery.options.address), 'ether'));
            console.log('balance', balance);
            setIsLoading(false);
            setMessage(null);
        } catch (error) {
            console.error('Error entering lottery:', error);
        }
    }

    const  pickAWinner = async () => {
        try {
            const accounts = await web3.eth.getAccounts();
            setMessage(`Attempting to auth from account from: ${accounts[0]}`);
            await lottery.methods.pickWinner().send({
                from: accounts[0]
            });
            setMessage('Successfully picked a winner');
            setIsLoading(false);
            setMessage(null);
            setPlayers([]);
        } catch (error) {
            setMessage(error.message);
            console.error('Error picking winner:', error);
        }
    }

    return (
        <>
            {isLoading && (
                <div>
                    <h1>Loading...</h1>
                </div>
            )}
            {!isLoading && (
                <>
                    <h1>The contract is managed by {manager.length > 0 ? manager : 'Unknown'}</h1>
                    <p>There are currently {players.length > 0 ? players.length : 0} people entered for competing to
                        win {balance} ether!</p>

                    <hr/>
                    <form onSubmit={onSubmit}>
                        <h4>Want to try your luck?</h4>
                        <div>
                            <label htmlFor="AmountOfEther">Amount of Ether</label> <br/>
                            <input type="text" value={value} onChange={(value) => {
                                console.log('value', value.target.value);
                                setValue(value.target.value);
                            }}/>
                            <br/> <br/>
                            <button>Enter</button>
                        </div>
                    </form>
                    <br/>
                    {message ?? message}
                    <br/>
                    <hr/>
                    <h4>Pick a Winner (Manager profile only)</h4>
                    <button onClick={pickAWinner}>
                        Close lottery and pick a winner now!
                    </button>
                </>
            )}
        </>
    );
}

export default App;
