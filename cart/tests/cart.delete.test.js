const cartModel = require('../src/models/cart.model');
const { deleteCartItem } = require('../src/controllers/cart.controller');

// Mock the cart model
jest.mock('../src/models/cart.model');

describe('deleteCartItem Controller', () => {

    let req, res;

    beforeEach(() => {
        req = {
            params: { productId: '123' },
            user: { id: 'user1' }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    // ✅ Test 1: Successful deletion
    test('should remove item from cart and return 200', async () => {

        const mockCart = {
            items: [
                { productId: '123' },
                { productId: '456' }
            ],
            save: jest.fn()
        };

        cartModel.findOne.mockResolvedValue(mockCart);

        await deleteCartItem(req, res);

        expect(mockCart.items.length).toBe(1); // item removed
        expect(mockCart.save).toHaveBeenCalled();

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Item removed successfully',
            cart: mockCart
        });
    });

    // ❌ Test 2: Cart not found
    test('should return 404 if cart not found', async () => {

        cartModel.findOne.mockResolvedValue(null);

        await deleteCartItem(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Cart not found'
        });
    });

    // ❌ Test 3: Item not found in cart
    test('should return 404 if item not found', async () => {

        const mockCart = {
            items: [{ productId: '999' }],
            save: jest.fn()
        };

        cartModel.findOne.mockResolvedValue(mockCart);

        await deleteCartItem(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Item not found'
        });
    });
    });