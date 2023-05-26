const Channels = ({ provider, account, aloha, channels, currentChannel, setCurrentChannel }) => {

  const channelHandler = async(channel) => {

    const hasJoined = await aloha.hasJoined(channel.id, account)
    console.log("Before IF")

     if (hasJoined) {
      console.log("inside IF")
      setCurrentChannel(channel)
    } else {
      console.log("Inside ELSE")
      const signer = await provider.getSigner()
      const transaction = await aloha.connect(signer).mint(channel.id, { value: channel.cost })
      await transaction.wait()
      setCurrentChannel(channel)
    }
  }
  return (
    <div className="channels">
      <div className="channels__text">
        <h2>Text Channels</h2>

        <ul>
          {channels.map((channel, index)=> (
            <li 
              key={index}
              onClick={() => channelHandler(channel)}
              className ={currentChannel && currentChannel.id.toString === channel.id.toString() ? "active" : ""}>
            {channel.name}</li>
          ))}
        </ul>

      </div>

      <div className="channels__voice">
        <h2>Voice Channels</h2>

        <ul>
          <li>Channel 1</li>
          <li>Channel 2</li>
          <li>Channel 3</li>
        </ul>
      </div>
    </div>
  );
}

export default Channels;