import mongoose from 'mongoose';
import {updateIfCurrentPlugin} from 'mongoose-update-if-current'

interface ProudctAttr {
    name: string;
    price: number;
    userId: string;
    category: string;
    subCategory: string;  
    availableItems: number;  
}

interface ProductDoc extends mongoose.Document {
    name: string;
    price: number;
    userId: string;
    category: string;
    subCategory: string;  
    version: number;
    availableItems: number;  
}

interface ProductModel extends mongoose.Model <ProductDoc> {
    build(attrs: ProudctAttr): ProductDoc
}

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required:true
    },
    price: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    subCategory: {
        type: String,
        required: true
    },
    mediaLinks: {
        type: Array
    },
    availableItems: {
        type: Number,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete(ret._id);
        }
    }
});

productSchema.set('versionKey', 'version');
productSchema.plugin(updateIfCurrentPlugin);
productSchema.statics.build = (attr: ProudctAttr) => {
    return new Product(attr);
}

const Product = mongoose.model<ProductDoc, ProductModel>('Product', productSchema);

export {Product};