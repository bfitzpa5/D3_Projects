# -*- coding: utf-8 -*-
"""
Created on Thu Nov  7 14:40:39 2019

@author: Brendan Non-Admin
"""

import numpy as np
import pandas as pd
import requests
from bs4 import BeautifulSoup
import os

def loan_status_filter(input_df):
    df = input_df.copy()
    loan_status_lst = [
            'Fully Paid',
            'Charged Off',
            #'Late (16-30 days)',
            #'Late (31-120 days)',
            'Default',
    ]
    mask = df.loan_status.isin(loan_status_lst)
    return df.loc[mask, :]

def state_abbr_table():
    url = r'https://www.50states.com/abbreviations.htm'
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    table = str(soup.find('table', class_="stripedRows"))
    return pd.read_html(table)[0]

def dc_filter(input_df):
    df = input_df.copy()
    return df.loc[df['US State'] != 'District of Columbia', :]

fname = os.path.join(
    os.path.expanduser('~'), 'Documents', 'GitHub', 'Metis_Projects', 
    '03-mcnulty', 'Data', 'loan.csv'
)
df = (pd.read_csv(fname)
    .pipe(loan_status_filter)
    .assign(default=lambda x: np.where(x.loan_status=='Fully Paid', 'fully_paid', 'default'))
    .loc[:, ['addr_state', 'default']])

df_states = (state_abbr_table()
    .rename(columns=lambda x: x.replace(':', ''))
    .set_index('Abbreviation'))

(df.pivot_table(index='addr_state', columns='default', aggfunc=len, fill_value=0)
 .join(df_states, how='left')
 .assign(total_loans=lambda x: x['fully_paid'] + x['default'],
         default_rate=lambda x: x['default'].div(x['total_loans']))
 .pipe(dc_filter)
 .rename(columns={'US State': 'state'})
 .set_index('state')
 .to_csv(r'Data/default_rates_by_state.csv'))