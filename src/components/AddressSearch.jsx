import React, { useState, useCallback } from 'react'
import clsx from 'clsx'
import { AddressAutofill, AddressMinimap, useConfirmAddress } from '@mapbox/search-js-react'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiMTI4ODAxNTUiLCJhIjoiY2x2cnY3d2ZkMHU4NzJpbWdwdHRvbjg2NSJ9.Mn-C9eFgQ8kO-NhEkrCnGg'

const styleConstants = {
    fieldSpacing: { mb: 2 }
};

const MapboxExample = () => {
    const [activePage, setActivePage] = useState('shipping')
    const [formData, setFormData] = useState()
    const [minimapFeature, setMinimapFeature] = useState()
    const { formRef, showConfirm } = useConfirmAddress({
        accessToken: MAPBOX_ACCESS_TOKEN
    });

    const handleAutofillRetrieve = (response) => {
        setMinimapFeature(response.features[0])
    }

    const handleFormSubmit = useCallback(async (e) => {
        e.preventDefault()
        const result = await showConfirm()

        if (result.type === 'nochange') {
            setFormData(new FormData(e.target))
            setActivePage('confirm')
        }
    }, [showConfirm]);

    const handleChangeAddress = () => {
        setActivePage('shipping')
    }

    const handleTryAgain = () => {
        formRef.current.reset()
        setMinimapFeature()
        setActivePage('shipping')
    }

    let displayAddress

    if (formData) {
        displayAddress = (
            <>
                {formData.get('first-name')} {formData.get('last-name')}<br />
                {formData.get('address-line1 address-search')}<br />
                {formData.get('address-line2') && (<>{formData.get('address-line2')} <br /></>)}
                {formData.get('address-level2')} {formData.get('address-level1')} {formData.get('postal-code')}
            </>
        )
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Paper elevation={3} sx={{ padding: 3, maxWidth: 600, width: '100%' }}>
                <div>
                    <h4>Shipping Address</h4>
                    <form className="flex flex--column" ref={formRef} onSubmit={handleFormSubmit}>
                        <div className='grid grid--gut12'>
                            <TextField
                                name="customerName"
                                label="Customer Name"
                                required
                                fullWidth
                                sx={styleConstants.fieldSpacing}
                            />
                        </div>

                        <AddressAutofill accessToken={MAPBOX_ACCESS_TOKEN} onRetrieve={handleAutofillRetrieve}>
                            <FormControl fullWidth sx={styleConstants.fieldSpacing}>
                                <InputLabel htmlFor="address">Address</InputLabel>
                                <TextField
                                    id="address"
                                    name="address"
                                    variant="outlined"
                                    autoComplete="address-line1"
                                    fullWidth
                                    label="Address"
                                />
                            </FormControl>
                        </AddressAutofill>

                        <TextField
                            label="Apartment, suite, etc. (optional)"
                            name="apartment"
                            variant='outlined'
                            autoComplete='address-line2'
                            fullWidth
                            sx={styleConstants.fieldSpacing}
                        />

                        <div className='grid grid--gut12 mb12'>
                            <div className='col w-1/3'>
                                <TextField
                                    label="City"
                                    name="address-level2"
                                    variant='outlined'
                                    autoComplete='address-level2'
                                    required
                                    fullWidth
                                    sx={styleConstants.fieldSpacing}
                                />
                            </div>
                            <div className='col w-1/3'>
                                <TextField
                                    label="State / Region"
                                    name="address-level1"
                                    variant='outlined'
                                    autoComplete='address-level1'
                                    required
                                    fullWidth
                                    sx={styleConstants.fieldSpacing}
                                />
                            </div>
                            <div className='col w-1/3'>
                                <TextField
                                    label="ZIP / Postcode"
                                    name="postal-code"
                                    variant='outlined'
                                    autoComplete='postal-code'
                                    required
                                    fullWidth
                                    sx={styleConstants.fieldSpacing}
                                />
                            </div>
                        </div>

                        <div id="minimap-container" className={clsx("h180 wfull relative mt18 mb60", {
                            none: !minimapFeature
                        })}>
                            <AddressMinimap
                                feature={minimapFeature}
                                show={!!minimapFeature}
                                satelliteToggle
                                canAdjustMarker
                                footer
                                accessToken={MAPBOX_ACCESS_TOKEN}
                            />
                        </div>

                        <div className="mb12 submit-btns align-r">
                            <button type="submit" className="btn round">
                                Add Location
                            </button>
                        </div>
                    </form>
                </div>

                <div className={clsx("confirm-page", {
                    'none': activePage === 'shipping'
                })}>
                    <div className={clsx("confirm-order-blurb", {
                        'none': activePage !== 'confirm'
                    })}>
                        
                    </div>

                    <div className={clsx("order-submitted-blurb mb24", {
                        'none': activePage !== 'complete'
                    })}>
                        <h4 className="txt-l txt-bold mb6">Order Submitted!</h4>

                        <button className="txt-ms border-b color-blue color-blue-dark-on-hover link restart-button inline-block" onClick={handleTryAgain}>Clear Entries</button>
                    </div>

                    <div className="round border border--gray-light px18 py6 flex mb24">
                        <div className="txt-bold mr24 w60">Order</div>
                        <div className="flex-child-grow">1 - Mapbox Developer Tee Shirt</div>
                    </div>

                    <div className="round border border--gray-light px18 py6 flex mb24">
                        <div className="txt-bold mr24 w60">Ship To</div>
                        <div className="flex-child-grow" id="shipping-address">
                            {displayAddress}
                        </div>
                        <div className={clsx({ 'none': activePage !== 'confirm' })}>
                            <Button onClick={handleChangeAddress} variant="contained" color="secondary" >Change</Button>
                        </div>
                    </div>

                    <div className={clsx("mb12 submit-btns align-r", {
                        'none': activePage !== 'confirm'
                    })}>
                        
                    </div>
                </div>
            </Paper>
        </Box>
    )
}

export default MapboxExample
