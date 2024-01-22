import { toast } from "react-toastify";
import { orderActions } from "./order-slice";
import axios from "axios";

export const createOrder = (orderData) => {
  return async (dispatch) => {
    try {
      dispatch(
        orderActions.newOrderReducer({
          loading: true,
          order: {},
        })
      );
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post("/api/v1/order/new", orderData, config);
      dispatch(
        orderActions.newOrderReducer({
          loading: false,
          order: data,
        })
      );
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
};

export const fetchAllOrders = () => {
  return async (dispatch) => {
    try {
      dispatch(
        orderActions.fetchOrdersReducer({
          loading: true,
          orders: [],
        })
      );
      const { data } = await axios.get("/api/v1/me/orders");
      dispatch(
        orderActions.fetchOrdersReducer({
          loading: false,
          orders: data,
        })
      );
    } catch (error) {
      dispatch(
        orderActions.fetchOrdersReducer({
          loading: false,
          orders: [],
        })
      );
      toast.error(error.response.data.message);
    }
  };
};

export const fetchOrderDetails = (orderId) => {
  return async (dispatch) => {
    try {
      dispatch(
        orderActions.orderDetailReducer({
          loading: true,
          orderDetail: {},
        })
      );
      const { data } = await axios.get(`/api/v1/order/${orderId}`);
      dispatch(
        orderActions.orderDetailReducer({
          loading: false,
          orderDetail: data,
        })
      );
    } catch (error) {
      dispatch(
        orderActions.orderDetailReducer({
          loading: false,
          orderDetail: {},
        })
      );
      toast.error(error.response.data.message);
    }
  };
};

export const fetchAdminOrders = () => {
  return async (dispatch) => {
    try {
      dispatch(
        orderActions.adminOrdersReducer({
          loading: true,
          orders: [],
          totalAmount: 0,
        })
      );
      const { data } = await axios.get("/api/v1/admin/orders");
      dispatch(
        orderActions.adminOrdersReducer({
          loading: false,
          orders: data.orders,
          totalAmount: data.totalAmount,
        })
      );
    } catch (error) {
      dispatch(
        orderActions.adminOrdersReducer({
          loading: false,
          orders: [],
          totalAmount: 0,
        })
      );
      toast.error(error.response.data.message);
    }
  };
};

export const adminDeleteOrder = (orderId) => {
  return async (dispatch) => {
    try {
      await axios.delete(`/api/v1/admin/order/${orderId}`);
      dispatch(
        orderActions.adminOrderDeleteReducer({
          isDeleted: true,
        })
      );
    } catch (error) {
      dispatch(
        orderActions.adminOrderDeleteReducer({
          isDeleted: false,
        })
      );
      toast.error(error.response.data.message);
    }
  };
};

export const adminUpdateOrder = (orderId, orderData) => {
  return async (dispatch) => {
    try {
      dispatch(
        orderActions.adminOrderUpdateReducer({
          isUpdated: false,
          loading: true,
        })
      );
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      await axios.put(`/api/v1/admin/order/${orderId}`, orderData, config);
      dispatch(
        orderActions.adminOrderUpdateReducer({
          isUpdated: true,
          loading: false,
        })
      );
    } catch (error) {
      dispatch(
        orderActions.adminOrderUpdateReducer({
          isUpdated: false,
          loading: false,
        })
      );
      toast.error(error.response.data.message);
    }
  };
};
