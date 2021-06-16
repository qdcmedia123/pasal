export const rabbitMQWrapper =  {
    client: {
        publish: jest
           .fn()
           .mockImplementation((data: string, callback: () => void) => {
            
        })
    }
}