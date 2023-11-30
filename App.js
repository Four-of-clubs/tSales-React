// App.js

import React, { Component } from 'react';
import web3 from './web3';
import ticketSales_instance from './ticketSales';

class App extends Component {
  state = {
    ownerAddress: '',
    price: 0,
    ticket_id_to_purchase: '',
    ticket_id_to_check: '',
    addressForSwap: '',
  };

  async componentDidMount() {
    const ownerAddress = await ticketSales_instance.methods.owner().call();
    const price = await ticketSales_instance.methods.price().call();
    console.log('Owner Address:', ownerAddress);
    console.log('Price:', price);
    this.setState({
      ownerAddress,
      price: Number(price), // Convert price to a number if needed
    });
  }

  purchaseTicket = async (event) => {
    event.preventDefault();
    const ticket_id_to_purchase = this.state.ticket_id_to_purchase;
    const price = this.state.price;
  
    const accounts = await web3.eth.getAccounts();
    const userAddress = accounts[0];
  
    // Check if the user already owns a ticket
    const existingTicketID = await ticketSales_instance.methods.getTicketOf(userAddress).call();
    if (existingTicketID !== '0') {
      alert(`You already own a ticket (Ticket ID: ${existingTicketID}). Cannot purchase another ticket.`);
      return;
    }
  
    // Purchase a ticket if the user doesn't already own one
    alert(`
      ___Your Details___\n
      Ticket ID: ${ticket_id_to_purchase}
      Price: ${price}
    `);
  
    await ticketSales_instance.methods.buyTicket(ticket_id_to_purchase).send({
      from: userAddress,
      value: price,
      gasPrice: 8000000000,
      gas: 4700000,
    });
  };
  
  getTicket = async (event) => {
    event.preventDefault();

    const ticket_id_to_check = this.state.ticket_id_to_check;

    // Check if ticket_id_to_check exists
    if (!ticket_id_to_check) {
      alert('Please enter a valid ticket ID');
      return;
    }

    try {
      const ticket = await ticketSales_instance.methods.ticket_map(ticket_id_to_check).call();

      if (ticket.owner === '0x0000000000000000000000000000000000000000') {
        // Ticket has no owner
        alert(`No owner for Ticket ID: ${ticket_id_to_check}`);
      } else {
        // Ticket has an owner
        alert(`
          ___Ticket Details___\n
          Ticket ID: ${ticket_id_to_check}
          Owner: ${ticket.owner}
        `);
      }
    } catch (error) {
      // Handle error if any
      console.error('Error fetching ticket details:', error);
      alert('Error fetching ticket details. Please try again.');
    }
  };

  checkMyTicket = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();
    const userAddress = accounts[0];

    // Add your logic here to check the ticket for the user
    // You can use the userAddress to verify ownership or perform any other checks
    const ticketID = await ticketSales_instance.methods.getTicketOf(userAddress).call();

    // Check if the user owns a ticket
    const ticketOwnedMessage = ticketID === '0' ? 'No ticket owned' : `Ticket Owned: ${ticketID}`;

    alert(`
      ___Your Ticket Details___\n
      User Address: ${userAddress}
      ${ticketOwnedMessage}
    `);
  };

  offerSwap = async (event) => {
    event.preventDefault();
  
    const addressForSwap = this.state.addressForSwap;
  
    // Validate the address format
    if (!web3.utils.isAddress(addressForSwap)) {
      alert('Please enter a valid Ethereum address');
      return;
    }
  
    try {
      // Call the offerSwap method from the contract
      const accounts = await web3.eth.getAccounts();
      await ticketSales_instance.methods.offerSwap(addressForSwap).send({
        from: accounts[0],
        gasPrice: 8000000000,
        gas: 4700000,
      });
  
      // Successful offer, show a success alert
      alert(`
        ___Offer Swap___\n
        Offered to: ${addressForSwap}
        // Add more details based on your logic
        Offer successful!
      `);
    } catch (error) {
      // Handle error if the offer fails
      console.error('Error offering swap:', error);
      alert('Error offering swap. Please try again.');
    }
  };
  

  acceptSwap = async (event) => {
    event.preventDefault();
  
    const addressForSwap = this.state.addressForSwap;
  
    // Validate the address format
    if (!web3.utils.isAddress(addressForSwap)) {
      alert('Please enter a valid Ethereum address');
      return;
    }
  
    try {
      // Call the acceptSwap method from the contract
      const accounts = await web3.eth.getAccounts();
      await ticketSales_instance.methods.acceptSwap(addressForSwap).send({
        from: accounts[0],
        gasPrice: 8000000000,
        gas: 4700000,
      });
  
      // Successful acceptance, show a success alert
      alert(`
        ___Accept Swap___\n
        Accepted from: ${addressForSwap}
        // Add more details based on your logic
        Swap accepted!
      `);
    } catch (error) {
      // Handle error if the acceptance fails
      console.error('Error accepting swap:', error);
      alert('Error accepting swap. Please try again.');
    }
  };
  

  render() {
    return (
      <div>
        <h1>Ticket Sales Web App</h1>
        <br></br>

        <form onSubmit={this.purchaseTicket}>
          <label>Purchase Ticket</label>
          <br></br>
          <input
            id="ticket_id_to_purchase"
            name="ticket_id_to_purchase"
            placeholder="Enter Ticket ID"
            onChange={(event) => this.setState({ [event.target.name]: event.target.value })}
          />
          <button> Purchase </button>
        </form>

        <form onSubmit={this.getTicket}>
          <label>Check Availability</label>
          <br></br>
          <input
            id="ticket_id_to_check"
            name="ticket_id_to_check"
            placeholder="Enter Ticket ID"
            onChange={(event) => this.setState({ [event.target.name]: event.target.value })}
          />
          <button> Check </button>
        </form>

        <form onSubmit={this.checkMyTicket}>
          <label>Check My Ticket</label>
          <br></br>
          <button> Check </button>
        </form>

        <form onSubmit={this.offerSwap}>
          <label>Offer Swap</label>
          <br></br>
          <input
            id="addressForSwap"
            name="addressForSwap"
            placeholder="Enter Address for Swap"
            onChange={(event) => this.setState({ [event.target.name]: event.target.value })}
          />
          <button> Offer Swap </button>
        </form>

        <form onSubmit={this.acceptSwap}>
          <label>Accept Swap</label>
          <br></br>
          <input
            id="addressForSwap"
            name="addressForSwap"
            placeholder="Enter Address for Swap"
            onChange={(event) => this.setState({ [event.target.name]: event.target.value })}
          />
          <button> Accept Swap </button>
        </form>
      </div>
    );
  }
}

export default App;
