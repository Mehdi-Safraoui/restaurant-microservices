package tn.esprit.microservicelivraison;

public class OrderDTO {

    private Long id;
    private String commandeStatus;
    private double totalPrice;
    private String deliveryAddress;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCommandeStatus() {
        return commandeStatus;
    }

    public void setCommandeStatus(String commandeStatus) {
        this.commandeStatus = commandeStatus;
    }

    public double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }
}
